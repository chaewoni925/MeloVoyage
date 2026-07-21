const prisma = require("../config/prisma");

exports.getMyPage = async (userId) => {
    return await prisma.user.findUnique({
        where: {
            id: userId // 파라미터로 받은 userId 사용
        },
        select: {
            id: true,
            email: true,
            nickname: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true
        }
    });
};
// data 통째로 넘기는 거 수정
// req.body 검증 없이 data에 넣으면 수정하면 안되는 필드도 보낼 수 있음
exports.updateMyPage = async (userId, data) => {
    const { nickname, profileImage } = data // 수정 가능한 필드만 추출
    return await prisma.user.update({
        where: {
            id: userId // 파라미터로 받은 userId 사용
        },
        data: { nickname, profileImage }, // email 등은 여기 안 들어가므로 변경 불가
        select: {
            id: true,
            email: true,
            nickname: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true
        }
    });
};