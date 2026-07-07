const express = require("express")
const router = express.Router()
const {registerUser, loginUser, logoutUser} = require("../controllers/auth")

// 복수 가져올 때만 {} 사용

// 회원가입  ( http://localhost:5001/auth/signup )
router.route("/signup")  
.post(registerUser)

// 로그인 ( http://localhost:5001/auth/login )
router.route("/login")
.post(loginUser)

// 로그아웃 ( http://localhost:5001/auth/logout )
router.route("/logout")
.post(logoutUser)

module.exports = router