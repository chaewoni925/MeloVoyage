const userService = require("../services/userService");

exports.getMyPage = async (req, res, next) => {
    try {
        const user = await userService.getMyPage();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

exports.updateMyPage = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateMyPage(req.body);

        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (err) {
        next(err);
    }
};