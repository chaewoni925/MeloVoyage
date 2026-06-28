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
                photoUrl: null,
                reviewKeywords: []
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

const { extractTags } = require("../utils/tagMapper");

exports.saveTags = async (destinationId, reviews) => {

    const tags = extractTags(reviews);

    for (const tagName of tags) {

        // Tag가 있는지 확인
        let tag = await prisma.tag.findUnique({
            where: {
                name: tagName
            }
        });

        // 없으면 생성
        if (!tag) {
            tag = await prisma.tag.create({
                data: {
                    name: tagName
                }
            });
        }

        // DestinationTag 연결
        await prisma.destinationTag.upsert({
            where: {
                destinationId_tagId: {
                    destinationId,
                    tagId: tag.id
                }
            },
            update: {},
            create: {
                destinationId,
                tagId: tag.id
            }
        });
    }

    return tags;
};

exports.getDestinationByGooglePlaceId = async (placeId) => {
    return await prisma.destination.findUnique({
        where: {
            googlePlaceId: placeId
        }
    });
};