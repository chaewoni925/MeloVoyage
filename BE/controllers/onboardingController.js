const onboardingService = require("../services/onboardingService");

exports.getAvailableGenres = async (req, res) => {
    try {
        const genres = await onboardingService.getAvailableGenres(req.user.id);
        res.status(200).json({ genres });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "장르 목록 조회 중 오류가 발생했습니다." });
    }
};
 
exports.getAvailableArtists = async (req, res) => {
    try {
        const artists = await onboardingService.getAvailableArtists(req.user.id);
        res.status(200).json({ artists });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "아티스트 목록 조회 중 오류가 발생했습니다." });
    }
};


exports.getPreferences = async (req, res, next) => {
    try {
        const preferences = await onboardingService.getPreferences(req.user.id);

        res.status(200).json({
            success: true,
            data: preferences,
        });
    } catch (err) {
        next(err);
    }
};

exports.createPreferences = async (req, res, next) => {
    try {
        const preferences = await onboardingService.createPreferences(req.user.id, req.body);

        res.status(201).json({
            success: true,
            data: preferences,
        });
    } catch (err) {
        next(err);
    }
};

exports.updatePreferences = async (req, res, next) => {
    try {
        const preferences = await onboardingService.updatePreferences(req.user.id, req.body);

        res.status(200).json({
            success: true,
            data: preferences,
        });
    } catch (err) {
        next(err);
    }
};