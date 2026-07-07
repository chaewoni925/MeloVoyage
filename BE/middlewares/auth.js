const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const prisma = require("../config/prisma") // Prisma Client

// 로그인 이후 프로필 조회, 수정에 필요한 인증 미들웨어
const protect = asyncHandler(async (req, res, next) => {
    let token  
    
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token // 쿠키에서 토큰 꺼내기
    };

    if (!token) {
        res.status(401)
        throw new Error("로그인이 필요한 서비스입니다.")
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // 토큰 해독

        // findById + select("-password") → findUnique + select 화이트리스트
        // db 조회 후 req.user 라는 새 객체에 id, 닉네임을 채워넣음
        // 이후 컨트롤러(getMyPage, updateMyPage)가 req.user.id, req.user.nickname을 바로 꺼내 쓸 수 있음
        req.user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, nickname: true } // 필요한 필드만 명시적으로 나열
        })

        if (!req.user) {
            // [추가] 토큰은 유효한데 DB에 해당 유저가 없는 경우
            // (예: 토큰 발급 후 유저가 탈퇴한 경우) 방어
            res.status(401)
            throw new Error("유효하지 않은 토큰입니다.")
        }

        next()
    } catch (error) {
        res.status(401)
        throw new Error("유효하지 않은 토큰입니다.")
    }
});

module.exports = protect