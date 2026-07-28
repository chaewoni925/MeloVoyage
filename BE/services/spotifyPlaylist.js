// 스포티파이에 플리 내보내는 역할
const axios = require('axios');

// -----------------------------
// 1. 내 Spotify 프로필 조회 (플레이리스트 만들 때 user id 필요)
// -----------------------------
async function getMySpotifyProfile(accessToken) {
    const res = await axios.get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return res.data; // { id, display_name, email, ... } 
}

// -----------------------------
// 2. 빈 플레이리스트 생성
// -----------------------------
async function createEmptyPlaylist(accessToken, title, isPublic = false) {
    const res = await axios.post(
        `https://api.spotify.com/v1/me/playlists`,
        {
            name: title,
            public: isPublic,
            description: 'Created by MeloVoyage'
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return res.data; // { id, external_urls: { spotify }, ... }
}
 
// -----------------------------
// 3. 플레이리스트에 곡 추가
// -----------------------------
async function addTracksToPlaylist(accessToken, playlistId, spotifyTrackIds) {
    const uris = spotifyTrackIds.map(id => `spotify:track:${id}`);
 
    await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/items`,
        { uris },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }
    );
}
// 프로필 조회 - 빈 플리 생성 - 플리에 곡 넣어서 최종 플리 생성
async function createSpotifyPlaylist(accessToken, title, spotifyTrackIds) {
    console.log('1. 프로필 조회 시작');
    const profile = await getMySpotifyProfile(accessToken)
    console.log('1. 프로필 조회 성공:', profile);
    const spotifyUserId = profile.id;  // 이 줄이 빠졌을 가능성
    console.log('2. 플레이리스트 생성 시작');
    const playlist = await createEmptyPlaylist(accessToken, spotifyUserId, title)
    console.log('2. 생성 성공:', playlist.id);
    console.log('3. 곡 추가 시작');
    await addTracksToPlaylist(accessToken, playlist.id, spotifyTrackIds)
    console.log('3. 곡 추가 성공');
    return {
        spotifyPlaylistId: playlist.id,
        spotifyPlaylistUrl: playlist.external_urls.spotify,
        trackCount: spotifyTrackIds.length
    };
}

module.exports = { createSpotifyPlaylist };