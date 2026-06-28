const prisma = require("../config/prisma");

exports.savePlaylist = async (data) => {

    return await prisma.savedPlaylist.create({
        data: {
            userId: "40797225-a075-404b-b870-7e98b79e6e6c", // 임시
            title: data.title,
            sourceRecommendationId: data.sourceRecommendationId,
            spotifyPlaylistId: data.spotifyPlaylistId,
            spotifyPlaylistUrl: data.spotifyPlaylistUrl
        }
    });

};

exports.getPlaylists = async () => {
    return await prisma.savedPlaylist.findMany({
        where: {
            userId: "40797225-a075-404b-b870-7e98b79e6e6c" // 임시
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