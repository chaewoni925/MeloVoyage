const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth");
const recommendController = require("../controllers/recommendController");

// 플레이리스트 추천
router.post(
    "/playlist",
    protect,
    recommendController.recommendPlaylist
);

// 추천 이유 (팀원이 추후 구현)
router.get(
    "/explain/destination/:id",
    protect,
    recommendController.explainRecommendation
);

module.exports = router;