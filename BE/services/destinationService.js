const prisma = require("../config/prisma");
const googleMapsService = require("./googleMapsService");

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

exports.getDestinationReviews = async (placeId) => {
    return await googleMapsService.getPlaceDetails(placeId);
};

exports.getDestinationByGooglePlaceId = async (placeId) => {
    return await prisma.destination.findUnique({
        where: {
            googlePlaceId: placeId
        }
    });
};

exports.generateDestinationProfile = async (destinationId) => {

    const destination = await prisma.destination.findUnique({
        where: {
            id: destinationId
        }
    });

    if (!destination) {
        throw new Error("여행지를 찾을 수 없습니다.");
    }

    // TODO: Gemini로 무드 태그 생성
    const moodTags = [];

    // TODO: profileText 생성
    const profileText = "";

    // TODO: Voyage 임베딩 생성
    const embedding = null;

    // TODO: profileText, embedding DB 저장

    return destination;
};