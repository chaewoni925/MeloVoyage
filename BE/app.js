require("dotenv").config();
const cookieParser = require("cookie-parser");

const express = require("express");
const app = express();
// console.log('현재 DATABASE_URL:', process.env.DATABASE_URL);
// 미들웨어 설정
app.use(express.json());

// 쿠키 파서
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Server is running!");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`[BE] Server is running on http://localhost:${PORT}`);
});

// 회원가입/로그인/로그아웃 관련 라우트
const authRouter = require('./routes/authRoutes');
app.use('/auth', authRouter);

// 유저 관련 라우트
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const destinationRoutes = require("./routes/destinationRoutes");
app.use("/destinations", destinationRoutes);

const onboardingRoutes = require("./routes/onboardingRoutes");
app.use("/onboarding", onboardingRoutes);

const recommendRoutes = require("./routes/recommendRoutes");
app.use("/recommend", recommendRoutes);

const storageRoutes = require("./routes/storageRoutes");
app.use("/storage", storageRoutes);

const spotifyRoutes = require("./routes/spotifyRoutes");
app.use("/spotify",  spotifyRoutes);

const errorHandler = require("./middlewares/error")
app.use(errorHandler) // ← 반드시 라우터들보다 아래에