// 코사인 유사도 비교 테스트용 파일
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { embed } = require("./services/embeddService");

const TRACKS_PATH = path.join(__dirname, "./output/embeddedTracks.json");
const TOP_N = 5;

// -----------------------------
// 코사인 유사도
// -----------------------------
function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// -----------------------------
// 여행지 설명 -> 유사 곡 Top N
// -----------------------------
async function findTopTracks(destinationText, tracks) {
    const queryEmbedding = await embed(destinationText);

    const scored = tracks.map(track => ({
        trackName: track.trackName,
        artistName: track.artistName,
        genre: track.genre,
        moodTags: track.moodTags,
        score: cosineSimilarity(queryEmbedding, track.embedding)
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, TOP_N);
}

// -----------------------------
// MAIN
// -----------------------------
async function main() {
    if (!fs.existsSync(TRACKS_PATH)) {
        console.log(` ${TRACKS_PATH} 가 없습니다. 먼저 수집 스크립트를 실행하세요.`);
        return;
    }

    const allTracks = JSON.parse(fs.readFileSync(TRACKS_PATH, "utf-8"));
    const tracks = allTracks.filter(t => Array.isArray(t.embedding) && t.embedding.length > 0);
    console.log(` ${tracks.length}개 트랙 로드 완료 (전체 ${allTracks.length}개 중 임베딩 있는 것만)\n`);

    const destinations = [
        {
            name: "강릉",
            text: "바다와 노을을 보며 드라이브하기 좋은 여행지"
        },
        {
            name: "성수",
            text: "트렌디한 카페와 골목 산책을 즐기기 좋은 여행지"
        }
        // 여기에 테스트하고 싶은 여행지를 추가
    ];

    for (const dest of destinations) {
        console.log(`\n======  ${dest.name} (${dest.text}) ======`);

        const topTracks = await findTopTracks(dest.text, tracks);

        topTracks.forEach((t, i) => {
            console.log(
                `${i + 1}. ${t.trackName} - ${t.artistName} ` +
                `[${t.genre} / ${t.moodTags.join(", ")}] ` +
                `score=${t.score.toFixed(4)}`
            );
        });
    }

    console.log("\n======================");
    console.log("체크리스트:");
    console.log("1. 두 여행지의 Top 곡 순위가 다르게 나오는가?");
    console.log("2. 상위 점수 곡들의 moodTags가 여행지 설명과 실제로 관련 있어 보이는가?");
    console.log("3. score 값 자체의 스케일(예: 0.3~0.6 vs 0.7~0.9)이 합리적인가?");
    console.log("======================");
}

main();