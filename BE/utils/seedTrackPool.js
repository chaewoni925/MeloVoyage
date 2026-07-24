require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const INPUT_PATH = path.join(__dirname, "../output/embeddedTracks.json");

async function main() {
    if (!fs.existsSync(INPUT_PATH)) {
        console.log(` ${INPUT_PATH} 가 없습니다. embeddingGenerator.js를 먼저 실행하세요.`);
        return;
    }

    const tracks = JSON.parse(fs.readFileSync(INPUT_PATH, "utf-8"))
        .filter(t => Array.isArray(t.embedding) && t.embedding.length > 0);

    console.log(` 저장할 트랙: ${tracks.length}개`);

    let successCount = 0;
    let failCount = 0;

    for (const track of tracks) {
        try {
            // vector 타입은 '[0.1,0.2,...]' 형태의 문자열로 캐스팅해서 넣어야 함
            const vectorLiteral = `[${track.embedding.join(",")}]`;

            await prisma.$executeRaw`
                INSERT INTO "TrackPool" (
                    "spotifyTrackId", "name", "artist", "artistId",
                    "genre", "moodTags", "profileText", "embedding",
                    "albumImageUrl", "previewUrl", "cachedAt"
                ) VALUES (
                    ${track.spotifyTrackId}, ${track.trackName}, ${track.artistName}, ${track.artistId},
                    ${track.genre}, ${track.moodTags}::text[], ${track.profileText},
                    ${vectorLiteral}::vector,
                    ${track.albumImage}, ${track.previewUrl}, now()
                )
                ON CONFLICT ("spotifyTrackId") DO UPDATE SET
                    "name" = EXCLUDED."name",
                    "artist" = EXCLUDED."artist",
                    "genre" = EXCLUDED."genre",
                    "moodTags" = EXCLUDED."moodTags",
                    "profileText" = EXCLUDED."profileText",
                    "embedding" = EXCLUDED."embedding",
                    "albumImageUrl" = EXCLUDED."albumImageUrl",
                    "previewUrl" = EXCLUDED."previewUrl",
                    "cachedAt" = now()
            `;

            successCount++;
            if (successCount % 100 === 0) {
                console.log(`  ... ${successCount}개 처리됨`);
            }
        } catch (err) {
            failCount++;
            console.log(`   ${track.trackName} 저장 실패:`, err.message);
        }
    }

    console.log("\n======================");
    console.log("총 트랙 :", tracks.length);
    console.log("성공 :", successCount);
    console.log("실패 :", failCount);
    console.log("======================");
}

main()
    .catch(err => console.error(err))
    .finally(async () => await prisma.$disconnect());