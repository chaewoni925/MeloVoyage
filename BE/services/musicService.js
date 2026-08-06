const prisma = require("../config/prisma");

exports.getMyMusic = async (userId) => {
    const latestPlaylist = await prisma.savedPlaylist.findFirst({
        where: {userId},
        orderBy: { createdAt: "desc" },
        include: { tracks: { orderBy: { position: "asc" } } }
    });

    if (!latestPlaylist) {
        return { playlistTitle: null, tracks: [] };
    }

    return {
        playlistTitle: latestPlaylist.title,
        tracks: latestPlaylist.tracks
    };
};

// 인기 음악: 모든 사용자의 저장된 플레이리스트를 통틀어
// 가장 많이 저장된 곡 상위 N개 (spotifyTrackId 기준 집계)
exports.getPopularTracks = async (limit = 10) => {
    const result = await prisma.$queryRaw`
        SELECT
            "spotifyTrackId",
            "name",
            "artist",
            "albumImageUrl",
            "previewUrl",
            COUNT(*) AS "saveCount"
        FROM "saved_tracks"
        GROUP BY "spotifyTrackId", "name", "artist", "albumImageUrl", "previewUrl"
        ORDER BY "saveCount" DESC
        LIMIT ${limit}
    `;
 
    // BigInt로 반환되는 COUNT(*) 결과를 Number로 변환 (JSON 직렬화 시 에러 방지)
    return result.map(row => ({
        ...row,
        saveCount: Number(row.saveCount)
    }));
};