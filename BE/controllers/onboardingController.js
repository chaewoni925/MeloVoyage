const onboardingService = require("../services/onboardingService");

exports.getPreferences = async (req, res, next) => {
    try {
        const preferences = await onboardingService.getPreferences();

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
        const preferences = await onboardingService.createPreferences(req.body);

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
        const preferences = await onboardingService.updatePreferences(req.body);

        res.status(200).json({
            success: true,
            data: preferences,
        });
    } catch (err) {
        next(err);
    }
};