const storageService = require("../services/storageService");

exports.savePlaylist = async (req, res, next) => {
    try {

        const playlist = await storageService.savePlaylist(
            req.user.id,
            req.body
    );

        res.status(201).json({
            success: true,
            data: playlist
        });

    } catch (err) {
        next(err);
    }
};

exports.getPlaylists = async (req, res, next) => {
    try {

        const playlists = storageService.getPlaylists(req.user.id);

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