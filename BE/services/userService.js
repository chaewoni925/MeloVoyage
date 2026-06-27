const prisma = require("../config/prisma");

exports.getMyPage = async () => {
    return await prisma.user.findUnique({
        where: {
            id: 1
        },
        select: {
            id: true,
            email: true,
            nickname: true,
            favoriteGenres: true,
            favoriteArtists: true,
            createdAt: true,
            updatedAt: true
        }
    });
};