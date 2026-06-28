const prisma = require("../config/prisma");

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