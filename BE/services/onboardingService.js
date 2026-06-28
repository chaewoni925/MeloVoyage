const prisma = require("../config/prisma");

const TEST_USER_ID = "40797225-a075-404b-b870-7e98b79e6e6c";

exports.getPreferences = async () => {
    return await prisma.onboarding.findUnique({
        where: {
            userId: TEST_USER_ID
        }
    });
};

exports.createPreferences = async (data) => {
    return await prisma.onboarding.create({
        data: {
            userId: TEST_USER_ID,
            genres: data.genres,
            artistSeeds: data.artistSeeds
        }
    });
};

exports.updatePreferences = async (data) => {
    return await prisma.onboarding.update({
        where: {
            userId: TEST_USER_ID
        },
        data: {
            genres: data.genres,
            artistSeeds: data.artistSeeds
        }
    });
};