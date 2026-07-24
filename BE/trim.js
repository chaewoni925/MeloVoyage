// 많이 저장된 아티스트 곡 잘라내기
const fs = require("fs");
const path = require("path");

const INPUT_PATH = path.join(__dirname, "./output/collectedTracks.json");
const BACKUP_PATH = path.join(__dirname, "./output/collectedTracks.backup.json");
const TRACK_LIMIT = 10;

function main() {
    if (!fs.existsSync(INPUT_PATH)) {
        console.log(` ${INPUT_PATH} 가 없습니다.`);
        return;
    }

    const tracks = JSON.parse(fs.readFileSync(INPUT_PATH, "utf-8"));
    console.log(` 정리 전 총 트랙: ${tracks.length}개`);

    // 안전을 위해 백업 먼저 저장
    fs.writeFileSync(BACKUP_PATH, JSON.stringify(tracks, null, 2), "utf-8");
    console.log(` 백업 저장: ${BACKUP_PATH}`);

    const counts = new Map();
    const trimmed = [];
    let removedCount = 0;

    for (const track of tracks) {
        const current = counts.get(track.artistName) ?? 0;

        if (current < TRACK_LIMIT) {
            trimmed.push(track);
            counts.set(track.artistName, current + 1);
        } else {
            removedCount++;
        }
    }

    fs.writeFileSync(INPUT_PATH, JSON.stringify(trimmed, null, 2), "utf-8");

    console.log("\n======================");
    console.log("정리 후 총 트랙:", trimmed.length);
    console.log("제거된 트랙:", removedCount);
    console.log(` 저장 완료: ${INPUT_PATH}`);
    console.log("======================");

    // 남은 트랙 ID 집합
    const keepIds = new Set(trimmed.map(t => t.spotifyTrackId));

    // taggedTracks.json 동기화
    const TAGGED_PATH = path.join(__dirname, "./output/taggedTracks.json");
    if (fs.existsSync(TAGGED_PATH)) {
        const tagged = JSON.parse(fs.readFileSync(TAGGED_PATH, "utf-8"));
        const taggedTrimmed = tagged.filter(t => keepIds.has(t.spotifyTrackId));
        fs.writeFileSync(TAGGED_PATH, JSON.stringify(taggedTrimmed, null, 2), "utf-8");
        console.log(` taggedTracks.json 정리: ${tagged.length} → ${taggedTrimmed.length}`);
    }

    // embeddedTracks.json 동기화
    const EMBEDDED_PATH = path.join(__dirname, "./output/embeddedTracks.json");
    if (fs.existsSync(EMBEDDED_PATH)) {
        const embedded = JSON.parse(fs.readFileSync(EMBEDDED_PATH, "utf-8"));
        const embeddedTrimmed = embedded.filter(t => keepIds.has(t.spotifyTrackId));
        fs.writeFileSync(EMBEDDED_PATH, JSON.stringify(embeddedTrimmed, null, 2), "utf-8");
        console.log(` embeddedTracks.json 정리: ${embedded.length} → ${embeddedTrimmed.length}`);
    }
}

main();