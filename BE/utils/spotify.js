// 처음 데이터 모을 때만 실행하는 파일
// 아티스트, 개별 곡(트랙) 수집 후 장르/분위기 매핑 -> profiletext 생성
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");

const artists = require("../artists.json");
const moodDictionary = require("../genreMoodDictionary.json");

// -----------------------------
// Config
// -----------------------------
const TRACK_LIMIT = 10;
const REQUEST_DELAY_MS = 150; // Spotify API 레이트리밋 대응
const OUTPUT_PATH = path.join(__dirname, "../output/collectedTracks.json");

const collectedTracks = [];
const seenTrackIds = new Set();
const artistTrackCounts = new Map(); // 아티스트별 기존 수집 곡 수 추적

// -----------------------------
// 기존 수집 결과 로드 (누적 수집 지원)
// -----------------------------
function loadExisting() {
    if (!fs.existsSync(OUTPUT_PATH)) return [];
    return JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// -----------------------------
// Access Token
// -----------------------------
async function getAccessToken() {
    const res = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({ grant_type: "client_credentials" }),
        {
            auth: {
                username: process.env.cid,
                password: process.env.secret
            }
        }
    );
    return res.data.access_token;
}

// -----------------------------
// Artist Search
// -----------------------------
async function searchArtist(token, artistName) {
    const res = await axios.get("https://api.spotify.com/v1/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: artistName, type: "artist", limit: 1 }
    });
    return res.data.artists.items[0];
}

// -----------------------------
// Track Search
// -----------------------------
// -----------------------------
// Artist's Albums 조회
// -----------------------------
async function getArtistAlbums(token, artistId) {
    const res = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}/albums`,
        {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                include_groups: "album,single",
                limit: 10
            }
        }
    );
    return res.data.items;
}

// -----------------------------
// Album Tracks 조회
// -----------------------------
async function getAlbumTracks(token, albumId) {
    const res = await axios.get(
        `https://api.spotify.com/v1/albums/${albumId}/tracks`,
        {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit: 10 }
        }
    );
    return res.data.items;
}

// -----------------------------
// 아티스트의 앨범들을 돌면서 트랙 수집 (album/track 엔드포인트는 아직 살아있음)
// -----------------------------
async function searchTracks(token, artistId, artistName) {
    const albums = await getArtistAlbums(token, artistId);
    const collected = [];
    const seenAlbumTrackIds = new Set();

    for (const album of albums) {
        if (collected.length >= TRACK_LIMIT) break;

        let albumTracks;
        try {
            albumTracks = await getAlbumTracks(token, album.id);
        } catch (err) {
            continue; // 개별 앨범 실패는 건너뜀
        }

        for (const track of albumTracks) {
            if (collected.length >= TRACK_LIMIT) break;
            if (seenAlbumTrackIds.has(track.id)) continue;

            // 앨범 트랙에는 popularity, album 정보가 없어서 앨범 정보를 붙여줌
            seenAlbumTrackIds.add(track.id);
            collected.push({
                ...track,
                album: {
                    name: album.name,
                    images: album.images
                },
                popularity: null // Album Tracks 응답엔 popularity가 없음
            });
        }

        await sleep(100); // 앨범 간 간단한 딜레이
    }

    return collected;
}

// -----------------------------
// profileText 생성 (트랙 단위)
// -----------------------------
function makeProfileText(track, genre, moodTags) {
    return `
곡 제목: ${track.name}

아티스트: ${track.artists.map(a => a.name).join(", ")}

앨범: ${track.album.name}

장르: ${genre}

분위기:
${moodTags.join(", ")}

이 음악은 ${moodTags.join(", ")} 분위기의 여행에 잘 어울리는 음악이다.
`;
}

// -----------------------------
// Artist 수집 (Spotify 메타데이터만, embedding 없음)
// -----------------------------
async function collectArtist(token, genre, artistName) {
    const existingCount = artistTrackCounts.get(artistName) ?? 0;

    if (existingCount >= TRACK_LIMIT) {
        console.log(`\n  ${artistName} - 이미 ${existingCount}곡 확보됨, 스킵`);
        return;
    }

    console.log(`\n🎤 ${artistName} (기존 ${existingCount}곡, ${TRACK_LIMIT - existingCount}곡 더 필요)`);

    let artist;
    try {
        artist = await searchArtist(token, artistName);
    } catch (err) {
        console.log(`   아티스트 검색 실패: ${artistName}`, err.response?.status);
        return;
    }

    if (!artist) {
        console.log("  Artist 없음");
        return;
    }

    let tracks;
    try {
        tracks = await searchTracks(token, artist.id, artistName);
    } catch (err) {
        console.log(`   트랙 검색 실패: ${artistName}`, err.response?.status);
        return;
    }

    const filtered = tracks.slice(0, TRACK_LIMIT);

    console.log(`  앨범 기반 수집 ${filtered.length}곡`);

    const moodTags = moodDictionary[genre] ?? [];

    for (const track of filtered) {
        if (seenTrackIds.has(track.id)) continue;
        seenTrackIds.add(track.id);

        const profileText = makeProfileText(track, genre, moodTags);

        collectedTracks.push({
            spotifyTrackId: track.id,
            trackName: track.name,
            artistName: artist.name,
            artistId: artist.id,
            genre,
            moodTags,
            profileText,
            // embedding은 여기서 생성하지 않음 -> embeddingGenerator.js 담당
            popularity: track.popularity ?? null,
            album: track.album.name,
            albumImage: track.album.images?.[0]?.url ?? null,
            previewUrl: track.preview_url ?? null,
            spotifyUrl: track.external_urls?.spotify ?? null
        });

        console.log(`  ✓ ${track.name}`);
    }
}

// -----------------------------
// MAIN
// -----------------------------
async function main() {
    try {
        // 기존에 수집된 트랙 로드 (누적 수집)
        const existingTracks = loadExisting();
        existingTracks.forEach(t => {
            seenTrackIds.add(t.spotifyTrackId);
            artistTrackCounts.set(t.artistName, (artistTrackCounts.get(t.artistName) ?? 0) + 1);
        });
        console.log(` 기존 수집된 트랙: ${existingTracks.length}개`);

        const token = await getAccessToken();
        console.log(" Token Ready");

        for (const genre of Object.keys(artists)) {
            console.log(`\n====== ${genre} ======`);
            for (const artistName of artists[genre]) {
                await collectArtist(token, genre, artistName);
                await sleep(REQUEST_DELAY_MS);
            }
        }

        const finalTracks = [...existingTracks, ...collectedTracks];

        console.log("\n======================");
        console.log("기존 트랙 :", existingTracks.length);
        console.log("신규 수집 :", collectedTracks.length);
        console.log("총 Track :", finalTracks.length);
        console.log("======================");

        fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalTracks, null, 2), "utf-8");
        console.log(`\n 저장 완료: ${OUTPUT_PATH}`);
        console.log("다음 단계: node generateMoodTags.js 실행 (신규 곡만 처리됨)");
    } catch (err) {
        console.log(err.response?.status);
        console.dir(err.response?.data, { depth: null });
    }
}

main();