const prisma = require("../config/prisma");
const googleMapsService = require("./googleMapsService");
const { generateDestinationTags } = require("../utils/llmTagGenerator"); // Gemini 기반 태그 생성
const { embed } = require("./embeddService"); // 곡 파이프라인에서 쓰던 Voyage 임베딩 함수 재사용

exports.importDestinations = async (keyword) => {
    const places = await googleMapsService.searchPlaces(keyword);

    for (const place of places) {
        await prisma.destination.upsert({
            where: {
                googlePlaceId: place.place_id
            },
            update: {},
            create: {
                googlePlaceId: place.place_id,
                name: place.name,
                category: place.types?.[0] || "unknown",
                address: place.formatted_address,
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
                photoUrl: null
            }
        });
    }

    return places.length;
};

// -----------------------------
// 도시 자체 등록 (5개 메인 여행지: 서울/부산/강릉/경주/제주)
// name을 우리가 원하는 값으로 고정해서, 나중에 정확히 일치 검색이 되게 함
// -----------------------------
exports.importMainDestination = async (cityName) => {
    const cityPlace = await googleMapsService.searchCity(cityName);
 
    if (!cityPlace) {
        throw new Error(`"${cityName}"에 대한 장소를 찾을 수 없습니다.`);
    }
 
    return await prisma.destination.upsert({
        where: { googlePlaceId: cityPlace.place_id },
        update: {},
        create: {
            googlePlaceId: cityPlace.place_id,
            name: cityName, // Google이 준 이름 대신 우리가 의도한 이름으로 고정
            category: cityPlace.types?.[0] || "locality",
            address: cityPlace.formatted_address,
            latitude: cityPlace.geometry.location.lat,
            longitude: cityPlace.geometry.location.lng,
            photoUrl: null
        }
    });
};
 

exports.getAllDestinations = async () => {
    return await prisma.destination.findMany({
        orderBy: {
            name: "asc"
        }
    });
};

exports.getDestinationById = async (id) => {
    return await prisma.destination.findUnique({
        where: {
            id
        }
    });
};

exports.searchDestinations = async (keyword) => {
    return await prisma.destination.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: keyword,
                        mode: "insensitive"
                    }
                },
                {
                    address: {
                        contains: keyword,
                        mode: "insensitive"
                    }
                }
            ]
        },
        orderBy: {
            name: "asc"
        }
    });
};

// exports.getDestinationReviews = async (placeId) => {
//     return await googleMapsService.getPlaceDetails(placeId);
// };

exports.getDestinationByGooglePlaceId = async (placeId) => {
    return await prisma.destination.findUnique({
        where: {
            googlePlaceId: placeId
        }
    });
};

// -----------------------------
// profileText 생성 (곡 파이프라인의 makeProfileText와 동일 패턴)
// -----------------------------
function makeProfileText(destination, moodTags) {
    return `
장소명: ${destination.name}
 
카테고리: ${destination.category}
 
분위기:
${moodTags.join(", ")}
 
이곳은 ${moodTags.join(", ")} 분위기를 느낄 수 있는 여행지이다.
`;
}
 
// -----------------------------
// LLM 태그 생성 + profileText 생성 + Voyage 임베딩 + DB 저장
// -----------------------------
exports.generateDestinationProfile = async (destinationId) => {
    const destination = await prisma.destination.findUnique({
        where: { id: destinationId }
    });
 
    if (!destination) {
        throw new Error("여행지를 찾을 수 없습니다.");
    }
 
    // 1. Gemini로 무드 태그 생성
    const moodTags = await generateDestinationTags({
        name: destination.name,
        category: destination.category
    });
 
    // 2. profileText 생성
    const profileText = makeProfileText(destination, moodTags);
 
    // 3. Voyage 임베딩
    const embedding = await embed(profileText);
 
    // 4. DB 저장 (embedding은 Unsupported 타입이라 $executeRaw 필요)
    const vectorLiteral = `[${embedding.join(",")}]`;
 
    await prisma.$executeRaw`
        UPDATE "destinations"
        SET "moodTags" = ${moodTags}::text[],
            "profileText" = ${profileText},
            "embedding" = ${vectorLiteral}::vector,
            "updatedAt" = now()
        WHERE id = ${destinationId}
    `;
 
    return {
        ...destination,
        moodTags,
        profileText
    }};
// exports.generateDestinationProfile = async (destinationId) => {

//     const destination = await prisma.destination.findUnique({
//         where: {
//             id: destinationId
//         }
//     });

//     if (!destination) {
//         throw new Error("여행지를 찾을 수 없습니다.");
//     }

//     // TODO: Gemini로 무드 태그 생성
//     const moodTags = [];

//     // TODO: profileText 생성
//     const profileText = "";

//     // TODO: Voyage 임베딩 생성
//     const embedding = null;

//     // TODO: profileText, embedding DB 저장

//     return destination;
// };