const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");
const recommendController = require("../controllers/recommendController");

router.post("/destinations", protect,recommendController.recommendDestinations);

router.get(
    "/explain/destination/:id",
    protect,
    recommendController.explainRecommendation
);

module.exports = router;