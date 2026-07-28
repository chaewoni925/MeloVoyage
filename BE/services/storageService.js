const prisma = require("../config/prisma");

exports.savePlaylist = async (userId, data) => {

    const recommendation = await prisma.recommendation.findUnique ({
        where: {id: data.recommendationId},
        include: { tracks: true, destination: true }
    }
    );

    if (!recommendation) {
        throw new Error("추천을 찾을 수 없습니다.")
    }

    return await prisma.savedPlaylist.create({
        data: {
            userId,
            title: data.title || `${recommendation.destination.name} `,
            sourceRecommendationId: recommendation.id,
            tracks: {
                create: recommendation.tracks.map((t, index) => ({
                    spotifyTrackId: t.spotifyTrackId,
                    name: t.name,
                    artist: t.artist,
                    albumImageUrl: t.albumImageUrl,
                    previewUrl: t.previewUrl,
                    position: index
                }))
            }
        },
        include: { tracks: true }
    });

    // return await prisma.savedPlaylist.create({
    //     data: {
    //         userId: userId, 
    //         title: data.title,
    //         sourceRecommendationId: data.sourceRecommendationId, // 이걸 안 넘겨줬네
    //         spotifyPlaylistId: data.spotifyPlaylistId,
    //         spotifyPlaylistUrl: data.spotifyPlaylistUrl
    //     }
    // });

};

exports.getPlaylists = async (userId) => {
    return await prisma.savedPlaylist.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

exports.getPlaylistById = async (id) => {
    return await prisma.savedPlaylist.findUnique({
        where: {
            id
        },
        include: {
            tracks: true
        }
    });
};

exports.deletePlaylist = async (id) => {
    return await prisma.savedPlaylist.delete({
        where: {
            id
        }
    });
};