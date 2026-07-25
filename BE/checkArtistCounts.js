// 아티스트 수 세는 용도
const fs = require("fs");
const path = require("path");

const INPUT_PATH = path.join(__dirname, "./output/collectedTracks.json");
const TRACK_LIMIT = 10;

function main() {
    if (!fs.existsSync(INPUT_PATH)) {
        console.log(` ${INPUT_PATH} 가 없습니다.`);
        return;
    }

    const tracks = JSON.parse(fs.readFileSync(INPUT_PATH, "utf-8"));
    console.log(` 총 트랙: ${tracks.length}개\n`);

    const counts = new Map();
    tracks.forEach(t => {
        counts.set(t.artistName, (counts.get(t.artistName) ?? 0) + 1);
    });

    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);

    const overLimit = sorted.filter(([, count]) => count > TRACK_LIMIT);
    const underLimit = sorted.filter(([, count]) => count < TRACK_LIMIT);
    const exactLimit = sorted.filter(([, count]) => count === TRACK_LIMIT);

    console.log(` ${TRACK_LIMIT}곡 초과 아티스트: ${overLimit.length}명`);
    overLimit.forEach(([name, count]) => {
        console.log(`  ${count}곡 - ${name} (초과분: ${count - TRACK_LIMIT})`);
    });

    console.log(`\n 정확히 ${TRACK_LIMIT}곡인 아티스트: ${exactLimit.length}명`);

    console.log(`\n  ${TRACK_LIMIT}곡 미만 아티스트: ${underLimit.length}명`);
    underLimit.forEach(([name, count]) => {
        console.log(`  ${count}곡 - ${name} (부족분: ${TRACK_LIMIT - count})`);
    });

    console.log("\n======================");
    console.log("전체 아티스트 수:", sorted.length);
    console.log("초과 아티스트 수:", overLimit.length);
    console.log("초과분 총 곡 수:", overLimit.reduce((sum, [, c]) => sum + (c - TRACK_LIMIT), 0));
    console.log("======================");
}

main();