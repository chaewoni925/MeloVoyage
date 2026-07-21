const prisma = require("../config/prisma");
const { getTagsFromGenres } = require("../utils/genreTagMapper");

exports.recommendDestinations = async(userId)=>{
    // 임시로 첫 번째 사용자의 온보딩 사용
    const onboarding=await prisma.onboarding.findUnique({
        where:{
            userId
        }
    });

    if (!onboarding) {
        throw new Error("온보딩 정보가 없습니다.");
    }

    // 장르 → 여행 태그
    const userTags = getTagsFromGenres(onboarding.genres);

    // 여행지 + 태그 조회
    const destinations = await prisma.destination.findMany({
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        }
    });

    // 점수 계산
    const scored = destinations.map(destination => {

        const destinationTags = destination.tags.map(t => t.tag.name);

        const score = destinationTags.filter(tag =>
            userTags.includes(tag)
        ).length;

        return {
            id: destination.id,
            name: destination.name,
            address: destination.address,
            category: destination.category,
            latitude: destination.latitude,
            longitude: destination.longitude,
            photoUrl: destination.photoUrl,
            score,
            tags: destinationTags
        };

    });

    // 점수 높은 순
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 5);

};

exports.explainRecommendation = async (userId, destinationId) => {

    const onboarding = await prisma.onboarding.findUnique({
        where: {
            userId
        }
    });

    if (!onboarding) {
        throw new Error("온보딩 정보가 없습니다.");
    }

    const userTags = getTagsFromGenres(onboarding.genres);

    const destination = await prisma.destination.findUnique({
        where: {
            id: destinationId
        },
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        }
    });

    if (!destination) {
        throw new Error("여행지를 찾을 수 없습니다.");
    }

    const destinationTags = destination.tags.map(t => t.tag.name);

    const matchedTags = destinationTags.filter(tag =>
        userTags.includes(tag)
    );

    return {
        destination: destination.name,
        matchedTags,
        message: matchedTags.length > 0
            ? "사용자의 음악 취향과 잘 맞는 여행지입니다."
            : "추천 태그가 일치하지 않았습니다."
    };

};