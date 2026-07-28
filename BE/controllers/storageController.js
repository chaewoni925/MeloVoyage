const storageService = require("../services/storageService");

exports.savePlaylist = async (req, res) => {
    try {
        const {recommendationId, title} = req.body // 클라이언트가 body로 보내는 값

        const playlist = await storageService.savePlaylist(
            req.user.id,
            {recommendationId, title}
            // 저장할 때 플레이리스트 이름 정함
    );

        res.status(201).json({
            success: true,
            data: playlist
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "저장 중 오류가 발생했습니다."})
    }
};

exports.getPlaylists = async (req, res, next) => {
    try {

        const playlists = await storageService.getPlaylists(req.user.id);

        res.status(200).json({
            success: true,
            data: playlists
        });

    } catch (err) {
        next(err);
    }
};

exports.getPlaylistById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const playlist = await storageService.getPlaylistById(id);

        res.status(200).json({
            success: true,
            data: playlist
        });

    } catch (err) {
        next(err);
    }
};

exports.deletePlaylist = async (req, res, next) => {
    try {
        const { id } = req.params;

        await storageService.deletePlaylist(id);

        res.status(200).json({
            success: true,
            message: "플레이리스트가 삭제되었습니다."
        });

    } catch (err) {
        next(err);
    }
};