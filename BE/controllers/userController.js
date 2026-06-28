const userService = require("../services/userService");

exports.getMyPage = async (req, res, next) => {
    try {
        const user = await userService.getMyPage(req.user.id);
        // 미들웨어의 protect가 넣어준 req.user.id 사용
        // 확인용
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
        const { nickname, profileImage } = req.body; // 수정 가능한 필드만 추출
        const updatedUser = await userService.updateMyPage(req.user.id, req.body);

        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (err) {
        next(err);
    }
};