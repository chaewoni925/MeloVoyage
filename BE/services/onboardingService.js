const prisma = require("../config/prisma");


exports.getAvailableGenres = async (userId) => {
    const result = await prisma.trackPool.findMany({
        distinct: ['genre'],
        select: {genre: true}
    });
    return result.map(r => r.genre);
};

exports.getAvailableArtists = async (userId) => {
    const result = await prisma.trackPool.findMany({
        distinct: ['artist'],
        select: { artist: true, albumImageUrl: true}
    });
    return result;
};

exports.getPreferences = async (userId) => {
    return await prisma.onboarding.findUnique({
        where: {
            userId
        }
    });
};

exports.createPreferences = async (userId, data) => {
    return await prisma.onboarding.create({
        data: {
            userId,
            genres: data.genres,
            artistSeeds: data.artistSeeds
        }
    });
};

exports.updatePreferences = async (userId, data) => {
    return await prisma.onboarding.update({
        where: {
            userId
        },
        data: {
            genres: data.genres,
            artistSeeds: data.artistSeeds
        }
    });
};