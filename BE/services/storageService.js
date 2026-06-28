const prisma = require("../config/prisma");

exports.savePlaylist = async (userId, data) => {

    return await prisma.savedPlaylist.create({
        data: {
            userId: userId, 
            title: data.title,
            sourceRecommendationId: data.sourceRecommendationId,
            spotifyPlaylistId: data.spotifyPlaylistId,
            spotifyPlaylistUrl: data.spotifyPlaylistUrl
        }
    });

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