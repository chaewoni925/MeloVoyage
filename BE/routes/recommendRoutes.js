const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");
const recommendController = require("../controllers/recommendController");
const playlist = require("../controllers/playlist"); // 여기서 특정 컨트롤러를 가져와라, 플리 관련만

// router.route("/playlist")
// .post()

// router.route("/playlist/regenerate")
// .post()

// router.route("explain/playlist/:id")
// .get()

router.post("/destinations", protect,recommendController.recommendDestinations);

router.get(
    "/explain/destination/:id",
    protect,
    recommendController.explainRecommendation
);

module.exports = router;