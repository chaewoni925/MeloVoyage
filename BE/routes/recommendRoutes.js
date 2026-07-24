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

// 플레이리스트 추천
router.post(
    "/playlist/regenerate",
    protect,
    recommendController.regeneratePlaylist
);


// 추천 이유 
router.get(
    "/explain/playlist/:id",
    protect,
    recommendController.explainRecommendation
);

module.exports = router;