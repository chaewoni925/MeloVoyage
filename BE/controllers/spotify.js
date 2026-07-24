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
 
module.exports = {getSpotifyRefreshToken, getAccessToken};