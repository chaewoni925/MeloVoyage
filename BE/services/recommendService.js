const prisma = require("../config/prisma");
const destinationService = require("./destinationService");

const RECOMMENDATION_TTL_MINUTES = 30;
const TOP_N = 10;

exports.recommendPlaylist = async (userId, destinationQuery) => {

    // 1차: 정확히 이름이 일치하는 것 우선
    let destination = await prisma.destination.findFirst({
        where: { name: destinationQuery }
    });

    // 2차: 정확히 일치하는 게 없으면, 포함되는 것 중 하나 (fallback)
    if (!destination) {
        destination = await prisma.destination.findFirst({
            where: { name: { contains: destinationQuery, mode: "insensitive" } }
        });
    }

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
    // 캐싱 체크: profileText가 아직 없으면 service에 있는 함수 호출해서 (신규 여행지) 생성
    if (!destination.profileText) {
        destination = await destinationService.generateDestinationProfile(destination.id);
    }
 
    // 여행지 임베딩을 텍스트로 조회 (Unsupported 타입은 Prisma Client로 직접 못 읽음)
    const destEmbeddingResult = await prisma.$queryRaw`
        SELECT embedding::text AS embedding_text
        FROM "destinations"
        WHERE id = ${destination.id}
    `;
    const destEmbeddingText = destEmbeddingResult[0]?.embedding_text;
 
    if (!destEmbeddingText) {
        throw new Error("여행지 임베딩이 아직 생성되지 않았습니다.");
    }
 
    // pgvector로 TrackPool과 코사인 유사도 비교
    const topTracks = await prisma.$queryRaw`
        SELECT
            "spotifyTrackId",
            "name",
            "artist",
            "genre",
            "moodTags",
            "albumImageUrl",
            "previewUrl"
        FROM "TrackPool"
        ORDER BY embedding <=> ${destEmbeddingText}::vector
        LIMIT ${TOP_N}
    `;
 
    // 매칭된 무드 태그 계산 (설명용)
    const matchedTags = [...new Set(
        topTracks.flatMap(t => t.moodTags.filter(tag => destination.moodTags.includes(tag)))
    )];
 
    const explanation = matchedTags.length > 0
        ? `${destination.name}의 ${matchedTags.join(", ")} 분위기에 어울리는 곡들을 추천했습니다.`
        : `${destination.name}과(와) 어울리는 곡들을 추천했습니다.`;
 
    const expiresAt = new Date(Date.now() + RECOMMENDATION_TTL_MINUTES * 60 * 1000);
 
    const recommendation = await prisma.recommendation.create({
        data: {
            userId,
            destinationId: destination.id,
            matchedTags,
            explanation,
            expiresAt,
            tracks: {
                create: topTracks.map((track, index) => ({
                    spotifyTrackId: track.spotifyTrackId,
                    name: track.name,
                    artist: track.artist,
                    albumImageUrl: track.albumImageUrl,
                    previewUrl: track.previewUrl,
                    position: index
                }))
            }
        },
        include: { tracks: true }
    });
 
    return {
        recommendationId: recommendation.id,
        destination: {
            name: destination.name,
            placeId: destination.googlePlaceId,
            description: destination.profileText
        },
        tracks: recommendation.tracks,
        expiresAt: recommendation.expiresAt
    };
};
 
// -----------------------------
// 재생성 (같은 여행지, 이전 곡 제외)
// -----------------------------
exports.regeneratePlaylist = async (recommendationId) => {
    const original = await prisma.recommendation.findUnique({
        where: { id: recommendationId },
        include: { tracks: true, destination: true }
    });
 
    if (!original) {
        throw new Error("기존 추천을 찾을 수 없습니다.");
    }
 
    const destEmbeddingResult = await prisma.$queryRaw`
        SELECT embedding::text AS embedding_text
        FROM "destinations"
        WHERE id = ${original.destinationId}
    `;
    const destEmbeddingText = destEmbeddingResult[0]?.embedding_text;
 
    const excludeIds = original.tracks.map(t => t.spotifyTrackId);
    const excludeList = excludeIds.length > 0 ? excludeIds : ['__none__'];
 
    const newTracks = await prisma.$queryRaw`
        SELECT
            "spotifyTrackId",
            "name",
            "artist",
            "genre",
            "moodTags",
            "albumImageUrl",
            "previewUrl"
        FROM "TrackPool"
        WHERE "spotifyTrackId" != ALL(${excludeList})
        ORDER BY embedding <=> ${destEmbeddingText}::vector
        LIMIT ${TOP_N}
    `;
 
    const matchedTags = [...new Set(
        newTracks.flatMap(t => t.moodTags.filter(tag => original.destination.moodTags.includes(tag)))
    )];
 
    const expiresAt = new Date(Date.now() + RECOMMENDATION_TTL_MINUTES * 60 * 1000);
 
    const recommendation = await prisma.recommendation.create({
        data: {
            userId: original.userId,
            destinationId: original.destinationId,
            matchedTags,
            explanation: original.explanation,
            expiresAt,
            tracks: {
                create: newTracks.map((track, index) => ({
                    spotifyTrackId: track.spotifyTrackId,
                    name: track.name,
                    artist: track.artist,
                    albumImageUrl: track.albumImageUrl,
                    previewUrl: track.previewUrl,
                    position: index
                }))
            }
        },
        include: { tracks: true }
    });
 
    return {
        recommendationId: recommendation.id,
        destination: {
            name: original.destination.name,
            placeId: original.destination.googlePlaceId,
            description: original.destination.profileText
        },
        tracks: recommendation.tracks,
        expiresAt: recommendation.expiresAt
    };
};
 
// -----------------------------
// 추천 이유 조회 (생성 시점에 저장해둔 값을 그대로 반환)
// -----------------------------
exports.explainRecommendation = async (userId,recommendationId) => {
    const recommendation = await prisma.recommendation.findUnique({
        where: { id: recommendationId },
        include: { destination: true, tracks: true }
    });
 
    if (!recommendation) {
        throw new Error("추천을 찾을 수 없습니다.");
    }
 
    return {
        destination: recommendation.destination.name,
        matchedTags: recommendation.matchedTags,
        message: recommendation.explanation,
        // trackCount: recommendation.recommended_tracks.length
    }};
    // profile 생성 (현재는 뼈대만 호출)
    // await destinationService.generateDestinationProfile(destination.id);
    // 이렇게 "profileText가 이미 있으면 스킵"하도록 수정함
//     if (!destination.profileText) {
//         await destinationService.generateDestinationProfile(destination.id);
//         // 갱신된 destination 다시 조회 필요
//         destination = await prisma.destination.findUnique({ where: { id: destination.id } });
//     }

//     return {
//         destination
//     };
// };

// exports.explainRecommendation = async () => {
//     throw new Error("아직 구현되지 않은 기능입니다.");
// };