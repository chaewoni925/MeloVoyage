const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const prisma = require("../config/prisma") // Prisma Client
require("dotenv").config({ quiet: true })
const jwtSecret = process.env.JWT_SECRET // .env 안의 비밀키 가져오기


// 회원가입 (db에 새로운 사용자 추가)
const registerUser = asyncHandler(async (req, res) => {
    const {email, nickname, password1, password2} = req.body
    // 요청한 거에서 이 세 개를 꺼내서 각각 변수에 저장함

    // guard clause 방식 - 검증이 늘어나도 평평하게 유지됨
    if (!nickname || nickname.length < 3) {
        // 닉네임 자체 검증 추가 — 빈 값/너무 짧은 아이디 방지
        res.status(400)
        throw new Error("아이디는 3자 이상이어야 합니다.")
    }
    if (password1 !== password2) {
        res.status(400)
        throw new Error("비밀번호가 일치하지 않습니다.")
    }
    if (password1.length < 8) {
        res.status(400)
        throw new Error("비밀번호는 8자 이상이어야 합니다.")
    }
    // 유저 이비에서 동일 아이디 있는지 찾아오기
    const existing = await prisma.user.findUnique({ where: { email: email } })
    if (existing) {
        res.status(409) // 409 Conflict로 변경
        throw new Error("이미 존재하는 이메일입니다.")
    }

    // 성공 로직
    const hashedPassword = await bcrypt.hash(password1, 10)

    try {
        // try/catch + P2002 캐치 추가
        // findUnique 체크와 create 사이의 시간차(race condition)로
        // 동시에 같은 username이 들어오면 DB의 @unique 제약이 최종 방어선이 됨.
        // 이 경우 Prisma가 P2002 에러를 던지므로 잡아서 친절한 메시지로 변환.
        const newUser = await prisma.user.create({
            data: { email, nickname, password: hashedPassword },
            select: { email: true, id: true, nickname: true }, // password 제외 — 해시값을 클라이언트에 노출하지 않음
        })
        res.json({ message: "회원 가입에 성공하였습니다.", newUser })
    } catch (err) {
        if (err.code === "P2002") {
            res.status(409)
            throw new Error("이미 존재하는 아이디입니다.")
        }
        throw err // 다른 종류 에러는 그대로 던져서 전역 에러 핸들러가 처리
    }
})

// 로그인 (사용자 인증)
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    // 유저 디비에서 이메일 찾기
    const user = await prisma.user.findUnique({ where: { email: email } })
    if (!user) {
        res.status(401) // 상태 코드 추가 — 없으면 기본값 200으로 응답되어 프론트엔드 분기 로직이 깨짐
        return res.json({ message: "유저를 찾을 수 없습니다." })
    }
    // 유저 디비에 저장되어 있는 패스워드와 비교
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        res.status(401) // 동일한 401로 통일
        // 주의: "유저 없음"과 "비밀번호 틀림"을 다른 상태 코드로 주면
        // 공격자가 "이 아이디가 존재한다"는 정보를 알아낼 수 있으므로 코드는 동일하게 유지
        return res.json({ message: "비밀번호가 일치하지 않습니다." })
    }

    // [중요] 일치하면 이제 토큰 발급, 첫 로그인을 할 때 토큰 발급 필요
    const token = jwt.sign({ id: user.id }, jwtSecret)
    res.cookie("token", token, { httpOnly: true }) // 응답할 때 쿠키에 토큰 담아서 전송
    res.json({ message: "로그인에 성공하였습니다." })
    // 응답 바디에서 token 제거
    // httpOnly 쿠키로 이미 전달함
})

// 로그아웃, 쿠키 삭제
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) })
    res.json({ message: "로그아웃 되었습니다." })
})

module.exports = { registerUser, loginUser, logoutUser }

