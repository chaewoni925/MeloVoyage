// 1. 사용자가 "Spotify 연결하기" 버튼 클릭
// 2. 프론트가 사용자를 Spotify 인증 페이지로 이동 (GET /spotify/login이 이 URL을 만들어줌)
// 3. 사용자가 Spotify에서 로그인 + 권한 동의
// 4. Spotify가 등록해둔 redirect_uri로 리다이렉트 → 이게 GET /spotify/callback
//    (이때 Spotify가 인증 코드(authorization code)를 쿼리 파라미터로 실어서 보냄)
// 5. 백엔드가 그 코드를 Spotify 토큰 발급 API에 보내서 access_token/refresh_token 받음
// 6. 백엔드가 그 토큰을 DB에 저장 (사용자 계정과 연결)
// 7. 콜백 처리가 끝나면 프론트의 특정 페이지로 다시 리다이렉트 (예: "연결 완료" 화면)

require('dotenv').config();
const axios = require('axios');
const prisma = require("../config/prisma") // Prisma Client
const spotifyService = require("../services/spotifyPlaylist")
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

async function getSpotifyRefreshToken(code) {
  const searchParams = new URLSearchParams();
  searchParams.append('grant_type', 'authorization_code');
  searchParams.append('redirect_uri', REDIRECT_URI);
  searchParams.append('code', code);

 const basicToken = Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'); 

  try {
   const response = await axios.post(SPOTIFY_TOKEN_ENDPOINT, searchParams, {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicToken}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function getAccessToken(refreshToken) {
    const searchParams = new URLSearchParams();
    searchParams.append('grant_type', 'refresh_token');
    searchParams.append('refresh_token', refreshToken);
 
    const basicToken = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
 
    try {
        const response = await axios.post(SPOTIFY_TOKEN_ENDPOINT, searchParams, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basicToken}`,
            },
        });
        console.log('Spotify 토큰 응답 전체:', response.data); // 확인용

 
        return response.data.access_token;
    } catch (err) {
        console.error('access_token 재발급 실패', err.response?.data ?? err.message);
        return null;
    }
}

const exportToSpotify = async (req,res) => {
  try {
    const { id } = req.params;
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(403).json({error: "Spotify 계정이 연동되지 않았습니다."});
    }

    const playlist = await prisma.savedPlaylist.findUnique(
      {
        where: { id },
        include: { tracks: true }
      }
    )
    if (!playlist) {
      return res.status(404).json({error: "저장된 플레이리스트를 찾을 수 없습니다."});
    }
    if (playlist.userId !== req.user.id) {
      return res.status(403).json({ error: "본인의 플레이리스트만 내보낼 수 있습니다." });
    }
    const accessToken = await getAccessToken(refreshToken);
    if (!accessToken) {
            return res.status(502).json({ error: "Spotify 토큰 갱신 실패" });
        }
 
    const spotifyTrackIds = playlist.tracks.map(t => t.spotifyTrackId);
            const result = await spotifyService.createSpotifyPlaylist(accessToken, playlist.title, spotifyTrackIds);
 
        // SavedPlaylist에 Spotify 생성 결과 반영
        await prisma.savedPlaylist.update({
            where: { id },
            data: {
                spotifyPlaylistId: result.spotifyPlaylistId,
                spotifyPlaylistUrl: result.spotifyPlaylistUrl
            }
        });
 
        res.status(201).json(result);
    } catch (err) {
        console.error(err.response?.data ?? err.message);
        res.status(500).json({ error: "Spotify 플레이리스트 생성 실패" });
    }
}
 
module.exports = {getSpotifyRefreshToken, getAccessToken, exportToSpotify};