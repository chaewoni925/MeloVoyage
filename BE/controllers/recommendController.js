const recommendService = require("../services/recommendService");

exports.recommendPlaylist = async (req, res) => {
    try {
        const { destinationQuery } = req.body;

        if (!destinationQuery || destinationQuery.trim() === "") {
            return res.status(400).json({ error: "여행지를 입력해주세요." });
        }

        const playlist = await recommendService.recommendPlaylist(
            req.user.id,
            destinationQuery
        );

        res.status(200).json({
            success: true,
            data: playlist
        });
    } catch (err) {
        console.error(err);
        if (err.message === "여행지를 찾을 수 없습니다.") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "추천 생성 중 오류가 발생했습니다." });
    }
};

exports.regeneratePlaylist = async (req, res) => {
    try {
        const { recommendationId } = req.body;
 
        if (!recommendationId) {
            return res.status(400).json({ error: "recommendationId가 필요합니다." });
        }
 
        const result = await recommendService.regeneratePlaylist(recommendationId);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        if (err.message === "기존 추천을 찾을 수 없습니다.") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "재생성 중 오류가 발생했습니다." });
    }
};

exports.explainRecommendation = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('받은 id:', id); // 이 줄 추가해서 확인

        const result = await recommendService.explainRecommendation(
            req.user.id,
            id
        );

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        console.error(err);
        if (err.message === "추천을 찾을 수 없습니다.") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "설명 조회 중 오류가 발생했습니다." });
    }
};