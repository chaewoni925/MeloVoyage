const express = require('express');
const router = express.Router();
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SCOPE = process.env.SCOPE;
const {getSpotifyRefreshToken, getAccessToken} = require("../controllers/spotify")
const { createSpotifyPlaylist } = require('../services/spotifyPlaylist');
require('dotenv').config();

router.get('/login', (req, res) => {
  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`);
});

router.get('/callback', async (req, res) => {
    const code = req.query.code;
//   const searchParams = new URLSearchParams(req.query);
//   const code = searchParams.get('code');

  const tokenResponse = await getSpotifyRefreshToken(code);
  console.log('Spotify 응답:', tokenResponse); // 확인용
  
  if (tokenResponse) { // tokenResponse에 값이 있을 경우 쿠키에 저장
    res.cookie('refresh_token', tokenResponse.refresh_token, {
      httpOnly: true,
    })
    res.redirect('http://localhost:5001?spotify_connect=success'); // 성공 시 어디로 리다이렉트 시킬 건지 생각해야 할 듯(예: 연결 완료 프론트 화면)
 
  } else
  res.redirect('http://localhost:5001?spotify_connect=failed')
  // res.redirect('http://localhost:5001'); // 이후 메인페이지로 리디렉션
});

router.post('/playlist/test', async(req, res) => {
    // 유효 검사 먼저 한 후 컨트롤러에게 넘겨줌
    try {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
        return res.status(403).json({error: "스포티파이 계정이 연동되지 않았습니다!"});
    }
    const accessToken = await getAccessToken(refreshToken); // 리프레시토큰 넘겨주고 액세스토큰 발급
    if (!accessToken) {
        return res.status(502).json({ error: 'Spotify 토큰 갱신 실패' }); // 못 받은 경우 처리
        }
    
               // TODO: 나중에 recommendService에서 나온 실제 추천 곡 ID로 교체
    const dummyTrackIds = [
            '6rdkCkjk6D12xRpdMXy0I2', // 실제 TrackPool에 있는 곡 ID로 테스트
            '0NGFAcYQVHCIdQea2qSs1I',
            '0tBbt8CrmxbjRP0pueQkyU'
        ];
    const result = await createSpotifyPlaylist(
        accessToken,
        '멜로보야지 테스트 플리',
        dummyTrackIds
    ); 
    res.status(201).json(result);
    } catch (err) {
        console.error(err.response?.data ?? err.message); 
        res.status(500).json({ error: 'Spotify 플레이리스트 생성 실패' });
    }
    
});

router.delete('/logout', (req, res) => {
  res.clearCookie('refresh_token');
  res.status(200).json({ message: 'Spotify 연동이 해제되었습니다.' });
  // 아예 접근 권한 해제하려면 스포티파이 계정에서 삭제해야한다는 안내문구 필요할 듯
});

module.exports = router;

