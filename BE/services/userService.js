const prisma = require("../config/prisma");

exports.getMyPage = async () => {
    return await prisma.user.findUnique({
        where: {
            id: "40797225-a075-404b-b870-7e98b79e6e6c"
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

exports.updateMyPage = async (data) => {
    return await prisma.user.update({
        where: {
            id: "40797225-a075-404b-b870-7e98b79e6e6c"
        },
        data,
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