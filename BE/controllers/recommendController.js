const recommendService = require("../services/recommendService");

exports.recommendPlaylist = async (req, res, next) => {
    try {
        const { destinationQuery } = req.body;

        const playlist = await recommendService.recommendPlaylist(
            req.user.id,
            destinationQuery
        );

        res.status(200).json({
            success: true,
            data: playlist
        });
    } catch (err) {
        next(err);
    }
};

exports.explainRecommendation = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await recommendService.explainRecommendation(
            req.user.id,
            id
        );

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};