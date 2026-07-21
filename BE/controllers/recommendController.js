const recommendService = require("../services/recommendService");

exports.recommendDestinations = async (req, res, next) => {
    try {

        const recommendations = await recommendService.recommendDestinations(req.user.id);
        res.status(200).json({
            success: true,
            data: recommendations
        });

    } catch (err) {
        next(err);
    }
};

exports.explainRecommendation = async (req, res, next) => {

    try {

        const { id } = req.params;

        const result = await recommendService.explainRecommendation(req.user.id,id);

        res.json({
            success: true,
            data: result
        });

    } catch (err) {

        next(err);

    }

};