const prisma = require("../config/prisma");
const destinationService = require("./destinationService");

exports.recommendPlaylist = async (userId, destinationQuery) => {

    let destination = await prisma.destination.findFirst({
        where: {
            name: {
                contains: destinationQuery,
                mode: "insensitive"
            }
        }
    });

    // DB에 없으면 Google Maps에서 가져오기
    if (!destination) {

        await destinationService.importDestinations(destinationQuery);

        destination = await prisma.destination.findFirst({
            where: {
                name: {
                    contains: destinationQuery,
                    mode: "insensitive"
                }
            }
        });

        if (!destination) {
            throw new Error("여행지를 찾을 수 없습니다.");
        }
    }

    // profile 생성 (현재는 뼈대만 호출)
    await destinationService.generateDestinationProfile(destination.id);

    return {
        destination
    };
};

exports.explainRecommendation = async () => {
    throw new Error("아직 구현되지 않은 기능입니다.");
};