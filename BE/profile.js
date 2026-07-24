// 임베딩 하기 전 profiletext 생성
const fs = require("fs");
const path = require("path");

const INPUT_PATH = path.join(__dirname, "./output/taggedTracks.json");
const OUTPUT_PATH = path.join(__dirname, "./output/profileReadyTracks.json");

// -----------------------------
// profileText 생성 (collectTracks.js와 동일한 형식)
// -----------------------------
function makeProfileText(track, genre, moodTags) {
    return `
곡 제목: ${track.trackName}

아티스트: ${track.artistName}

앨범: ${track.album}

장르: ${genre}

분위기:
${moodTags.join(", ")}

이 음악은 ${moodTags.join(", ")} 분위기의 여행에 잘 어울리는 음악이다.
`;
}

function main() {
    if (!fs.existsSync(INPUT_PATH)) {
        console.log(` ${INPUT_PATH} 가 없습니다.`);
        return;
    }

    const tracks = JSON.parse(fs.readFileSync(INPUT_PATH, "utf-8"));
    console.log(` ${tracks.length}개 트랙 로드`);

    const updated = tracks.map(track => ({
        ...track,
        profileText: makeProfileText(track, track.genre, track.moodTags)
    }));

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(updated, null, 2), "utf-8");

    console.log(` profileText 재생성 완료: ${updated.length}개`);
    console.log(` 저장 완료: ${OUTPUT_PATH}`);
    console.log("\n다음 단계: embeddingGenerator.js의 INPUT_PATH를 profileReadyTracks.json으로 변경 후 실행");
}

main();