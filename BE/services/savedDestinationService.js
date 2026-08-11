const prisma = require("../config/prisma");
const destinationService = require("./destinationService");

const MAIN_DESTINATIONS = ["서울", "부산", "강릉", "제주", "경주"];

exports.getPopularDestinations = async () => {
    return await prisma.destination.findMany({
        where: {
            name: { in: MAIN_DESTINATIONS }
        }
    });
};

// -----------------------------
// 여행지 저장 (map 탭에서 검색 후 저장 버튼)
// 검색 시점에 이미 profileText/embedding까지 완성된 상태여야 함
// -----------------------------
exports.saveDestination = async (userId, destinationId) => {
    const destination = await prisma.destination.findUnique({
        where: { id: destinationId }
    });

    if (!destination) {
        throw new Error("여행지를 찾을 수 없습니다.");
    }

    const existing = await prisma.savedDestination.findUnique({
        where: {
            userId_destinationId: { userId, destinationId }
        }
    });

    if (existing) {
        return existing;
    }

    return await prisma.savedDestination.create({
        data: { userId, destinationId }
    });
};

// -----------------------------
// 저장된 여행지 목록 조회
// -----------------------------
exports.getSavedDestinations = async (userId) => {
    const saved = await prisma.savedDestination.findMany({
        where: { userId },
        include: { destination: true },
        orderBy: { createdAt: "desc" }
    });

    return saved.map(s => ({
        savedId: s.id,
        savedAt: s.createdAt,
        ...s.destination
    }));
};

// -----------------------------
// 저장 삭제
// -----------------------------
exports.unsaveDestination = async (userId, destinationId) => {
    const existing = await prisma.savedDestination.findUnique({
        where: {
            userId_destinationId: { userId, destinationId }
        }
    });

    if (!existing) {
        throw new Error("저장된 여행지를 찾을 수 없습니다.");
    }

    await prisma.savedDestination.delete({
        where: { id: existing.id }
    });
};

// -----------------------------
// map 탭 검색: 여행지 등록 + 프로필(태그/텍스트/임베딩/사진) 완전 생성
// search 탭의 recommendPlaylist와 동일한 완성 로직을 재사용
// -----------------------------
exports.searchAndPrepareDestination = async (query) => {
    let destination = await destinationService.getOrCreateDestinationByQuery(query);
 
    if (!destination.profileText) {
        destination = await destinationService.generateDestinationProfile(destination.id);
    }
 
    return destination;
};

// exports.searchAndPrepareDestination = async (query) => {
//     let destination = await prisma.destination.findFirst({
//         where: { name: query }
//     });

//     if (!destination) {
//         destination = await prisma.destination.findFirst({
//             where: { name: { contains: query, mode: "insensitive" } }
//         });
//     }

//     if (!destination) {
//         await destinationService.importDestinations(query);
//         destination = await prisma.destination.findFirst({
//             where: { name: { contains: query, mode: "insensitive" } }
//         });
//         if (!destination) {
//             throw new Error("여행지를 찾을 수 없습니다.");
//         }
//     }

//     if (!destination.profileText) {
//         destination = await destinationService.generateDestinationProfile(destination.id);
//     }

//     return destination;
// };