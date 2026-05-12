require("dotenv").config({ quiet: true }) // 환경변수 최우선 로딩
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const prisma = require("./config/prisma")
const app = express();
const port = process.env.PORT; // env에 포트 번호 따로 빼놓음


// CORS 설정
app.use(cors());

// 미들웨어 설정
app.use(express.json());

// 쿠키 파서
app.use(cookieParser());

// 기본 라우트
app.get('/', (req, res) => {
  res.send('MELOVOYAGE Server is Running!');
});

// 서버 실행
app.listen(port, () => {
      console.log(`[BE] Server is running on http://localhost:${port}`);
    });

// 각주는 나중에 추가 예정
// if(false){ // 서버 새로 열 때 외부 데이터로 리로드 , debug 용
//   try {
//       console.log('\n[BE] Initial data collection starting...');
// } catch (err) {
//       console.error('[BE] Initial collection failed:', err.message);
// }}
