// voyage ai 이용하여 임베딩하는 파일
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { embedBatch } = require("../services/embeddService");

// -----------------------------
// Config
// -----------------------------
const INPUT_PATH = path.join(__dirname, "../output/profileReadyTracks.json");
const OUTPUT_PATH = path.join(__dirname, "../output/embeddedTracks.json");

const BATCH_SIZE = 100;         // 한 번의 API 요청에 담을 곡 수 (Voyage 배치 한도 내에서 조정 가능)
const REQUEST_DELAY_MS = 2000;  // 배치 요청 사이 딜레이
const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 2000;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getErrorStatus(err) {
    return (
        err.response?.status ??
        err.rawResponse?.status ??
        err.status ??
        err.statusCode
    );
}

// -----------------------------
// 재시도 + exponential backoff로 배치 embed 호출
// -----------------------------
async function embedBatchWithRetry(texts, label) {
    let attempt = 0;

    while (attempt <= MAX_RETRIES) {
        try {
            return await embedBatch(texts);
        } catch (err) {
            const status = getErrorStatus(err);
            const isRateLimited = status === 429;
            const isServerError = typeof status === "number" && status >= 500;
            const isRetryable = isRateLimited || isServerError;

            if (!isRetryable || attempt === MAX_RETRIES) {
                throw err;
            }

            const backoff = BASE_BACKOFF_MS * Math.pow(2, attempt);
            console.log(
                `  ⏳ [${label}] ${status ?? "네트워크 오류"} - ${backoff}ms 후 재시도 (${attempt + 1}/${MAX_RETRIES})`
            );
            await sleep(backoff);
            attempt++;
        }
    }
}

// -----------------------------
// 기존 진행 상황 로드 (이어서 실행 지원)
// -----------------------------
function loadExistingResults() {
    if (!fs.existsSync(OUTPUT_PATH)) return new Map();

    const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    const map = new Map();
    for (const track of existing) {
        if (track.embedding) {
            map.set(track.spotifyTrackId, track);
        }
    }
    return map;
}

function saveResults(tracks) {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(tracks, null, 2), "utf-8");
}

function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

// -----------------------------
// MAIN
// -----------------------------
async function main() {
    if (!fs.existsSync(INPUT_PATH)) {
        console.log(` ${INPUT_PATH} 가 없습니다. 먼저 collectTracks.js를 실행하세요.`);
        return;
    }

    const allTracks = JSON.parse(fs.readFileSync(INPUT_PATH, "utf-8"));
    console.log(` ${allTracks.length}개 트랙 로드`);

    const alreadyEmbedded = loadExistingResults();
    console.log(` 이미 임베딩 완료: ${alreadyEmbedded.size}개 (스킵됨)`);

    // 아직 임베딩 안 된 트랙만 필터링
    const pendingTracks = allTracks.filter(t => !alreadyEmbedded.has(t.spotifyTrackId));
    console.log(` 이번에 처리할 트랙: ${pendingTracks.length}개`);

    const results = [...alreadyEmbedded.values()];
    const batches = chunk(pendingTracks, BATCH_SIZE);

    console.log(` 총 ${batches.length}개 배치로 처리 (배치당 최대 ${BATCH_SIZE}곡)`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const label = `배치 ${i + 1}/${batches.length} (${batch.length}곡)`;

        try {
            const texts = batch.map(t => t.profileText);
            const embeddings = await embedBatchWithRetry(texts, label);

            batch.forEach((track, idx) => {
                results.push({
                    ...track,
                    embedding: embeddings[idx]
                });
            });

            successCount += batch.length;
            console.log(`  ✓ [${label}] 완료`);

            // 배치 단위로 중간 저장
            saveResults(results);

        } catch (err) {
            failCount += batch.length;
            const status = getErrorStatus(err);
            console.log(`   [${label}] 최종 실패:`, status ?? err.message);
            // 실패한 배치의 트랙들은 embedding 없이 건너뜀
            // -> 다음 실행 시 자동으로 재시도 대상이 됨 (results에 없으므로)
        }

        if (i < batches.length - 1) {
            await sleep(REQUEST_DELAY_MS);
        }
    }

    saveResults(results);

    console.log("\n======================");
    console.log("총 트랙 :", allTracks.length);
    console.log("신규 성공 :", successCount);
    console.log("실패 (다음 실행 시 재시도) :", failCount);
    console.log("최종 저장된 임베딩 트랙 :", results.length);
    console.log(` 저장 완료: ${OUTPUT_PATH}`);
    console.log("======================");

    if (failCount > 0) {
        console.log("\n 실패한 트랙이 있습니다. node embeddingGenerator.js 를 다시 실행하면 실패분만 재시도합니다.");
    }
}

main();