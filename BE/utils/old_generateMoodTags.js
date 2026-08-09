// llm 이용하여 곡의 분위기 태그 생성
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const genMoodDictionary = require("../genreMoodDictionary.json");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// -----------------------------
// Config
// -----------------------------
const INPUT_PATH = path.join(__dirname, "../output/collectedTracks.json");
const OUTPUT_PATH = path.join(__dirname, "../output/taggedTracks.json");

const BATCH_SIZE = 120;         // 하루 요청 한도(20회) 안에서 끝내기 위해 대폭 확대
const REQUEST_DELAY_MS = 4000;  // 배치 사이 딜레이
const MODEL = "gemini-2.5-flash-lite";
const MAX_RETRIES = 2;          // 일반 429(짧은 rate limit)만 재시도, 일일 한도 초과는 재시도 안 함
const BASE_BACKOFF_MS = 5000;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

// -----------------------------
// 프롬프트 구성
// -----------------------------
function buildPrompt(batch) {
    const referenceVocab = Object.values(genMoodDictionary).flat().join(", ");

    const trackList = batch
        .map((t, i) =>
            `${i}. 제목: "${t.trackName}" / 아티스트: "${t.artistName}" / 장르: "${t.genre}"`
        )
        .join("\n");

    return `
너는 여행 플레이리스트 추천 서비스를 위한 음악 분위기 태깅 전문가야.
아래 곡 목록 각각에 대해, 그 곡의 실제 분위기를 나타내는 한글 무드 태그를 3~5개씩 생성해줘.

규칙:
- 같은 장르라고 무조건 같은 태그를 반복하지 말고, 곡 제목/아티스트 정보를 참고해서 곡마다 최대한 다르게 뉘앙스를 반영해줘.
- 아래 참고 어휘를 우선적으로 활용하되, 곡에 안 맞으면 다른 한글 단어를 자유롭게 만들어도 돼.
- 참고 어휘: ${referenceVocab}
- 반드시 아래 JSON 배열 형식으로만 응답해. 다른 설명이나 마크다운 없이 순수 JSON만.

형식:
[
  { "index": 0, "moodTags": ["태그1", "태그2", "태그3"] },
  { "index": 1, "moodTags": ["태그1", "태그2", "태그3"] }
]

곡 목록:
${trackList}
`;
}

// -----------------------------
// 배치 하나 태깅 (재시도 포함)
// -----------------------------
async function tagBatchWithRetry(batch, label) {
    let attempt = 0;

    while (attempt <= MAX_RETRIES) {
        try {
            const response = await ai.models.generateContent({
                model: MODEL,
                contents: buildPrompt(batch),
                config: {
                    responseMimeType: "application/json"
                }
            });

            const text = response.text;
            const parsed = JSON.parse(text);

            if (!Array.isArray(parsed) || parsed.length !== batch.length) {
                throw new Error(`응답 개수 불일치: 기대 ${batch.length}, 실제 ${parsed?.length}`);
            }

            return parsed;

        } catch (err) {
            const status = err.status ?? err.response?.status;
            const errorText = err.message ?? "";

            // 하루 요청 한도(RequestsPerDay) 초과는 재시도로 해결 안 됨 -> 즉시 중단
            const isDailyQuotaExceeded =
                errorText.includes("PerDay") || errorText.includes("RequestsPerDay");

            if (isDailyQuotaExceeded) {
                const quotaError = new Error("DAILY_QUOTA_EXCEEDED");
                quotaError.isDailyQuotaExceeded = true;
                throw quotaError;
            }

            const isRateLimited = status === 429;
            const isServerError = typeof status === "number" && status >= 500;
            const isRetryable = isRateLimited || isServerError || errorText.includes("불일치");

            if (!isRetryable || attempt === MAX_RETRIES) {
                throw err;
            }

            const backoff = BASE_BACKOFF_MS * Math.pow(2, attempt);
            console.log(
                `   [${label}] ${status ?? errorText} - ${backoff}ms 후 재시도 (${attempt + 1}/${MAX_RETRIES})`
            );
            await sleep(backoff);
            attempt++;
        }
    }
}

// -----------------------------
// 기존 진행 상황 로드 (이어서 실행 지원)
// -----------------------------
function loadExisting() {
    if (!fs.existsSync(OUTPUT_PATH)) return new Map();

    const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    const map = new Map();
    for (const track of existing) {
        // fallback으로 채워진 곡은 "완료"로 치지 않고 재시도 대상으로 남겨둠
        if (track.moodTags && track.moodTags.length > 0 && !track.isFallbackTag) {
            map.set(track.spotifyTrackId, track);
        }
    }
    return map;
}

function saveResults(tracks) {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(tracks, null, 2), "utf-8");
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

    const alreadyTagged = loadExisting();
    console.log(` 이미 태깅 완료: ${alreadyTagged.size}개 (스킵됨)`);

    const pending = allTracks.filter(t => !alreadyTagged.has(t.spotifyTrackId));
    console.log(` 이번에 처리할 트랙: ${pending.length}개`);

    const results = [...alreadyTagged.values()];
    const batches = chunk(pending, BATCH_SIZE);

    console.log(` 총 ${batches.length}개 배치 (배치당 최대 ${BATCH_SIZE}곡) → API 호출 약 ${batches.length}회 예상\n`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const label = `배치 ${i + 1}/${batches.length} (${batch.length}곡)`;

        try {
            const tagged = await tagBatchWithRetry(batch, label);

            batch.forEach((track, idx) => {
                const match = tagged.find(t => t.index === idx);
                results.push({
                    ...track,
                    moodTags: match?.moodTags ?? genMoodDictionary[track.genre] ?? [],
                    isFallbackTag: !match
                });
            });

            successCount += batch.length;
            console.log(`  ✓ [${label}] 완료`);

            saveResults(results);

        } catch (err) {
            if (err.isDailyQuotaExceeded) {
                console.log(`\n [${label}] 일일 요청 한도 초과. 남은 배치는 저장하지 않고 중단합니다.`);
                console.log(`   (재시도해봐야 오늘은 복구 안 됨 - 태평양시간 자정 기준 리셋되거나, 결제수단 등록 시 즉시 상향됨)`);
                saveResults(results);
                console.log("\n======================");
                console.log("총 트랙 :", allTracks.length);
                console.log("LLM 태깅 성공 :", successCount);
                console.log("남은 미처리 트랙 :", allTracks.length - results.length);
                console.log(` 여기까지 저장 완료: ${OUTPUT_PATH}`);
                console.log("======================");
                console.log("\n다시 실행하면 이미 처리된 트랙은 스킵하고 이어서 진행합니다.");
                return;
            }

            failCount += batch.length;
            console.log(`   [${label}] 최종 실패, 기존 장르 태그로 대체:`, err.message);

            // 실패 시 fallback: 기존 genreMoodDictionary 값 사용
            batch.forEach(track => {
                results.push({
                    ...track,
                    moodTags: genMoodDictionary[track.genre] ?? [],
                    isFallbackTag: true
                });
            });
            saveResults(results);
        }

        if (i < batches.length - 1) {
            await sleep(REQUEST_DELAY_MS);
        }
    }

    console.log("\n======================");
    console.log("총 트랙 :", allTracks.length);
    console.log("LLM 태깅 성공 :", successCount);
    console.log("실패 (fallback 적용) :", failCount);
    console.log(` 저장 완료: ${OUTPUT_PATH}`);
    console.log(` 이번 실행 API 호출 횟수: 약 ${batches.length}회`);
    console.log("======================");
    console.log("\n다음 단계: profileText를 새 moodTags로 재생성한 뒤 embeddingGenerator.js 실행");
}

main();