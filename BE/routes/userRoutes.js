const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth")

const userController = require("../controllers/userController");

// 인증 미들웨어 추가 - 로그인 한 상태에서 프로필 조회, 수정 가능하게
router.get("/mypage", protect, userController.getMyPage);
router.patch("/mypage", protect, userController.updateMyPage);

module.exports = router;