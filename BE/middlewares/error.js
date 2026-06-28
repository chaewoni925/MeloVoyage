// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
    res.status(statusCode).json({
        message: err.message,
        // 개발 중에만 stack trace 포함, 배포 시엔 제거
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
}

module.exports = errorHandler