const express = require("express");
const router = express.Router();

const recommendController = require("../controllers/recommendController");

router.post("/destinations", recommendController.recommendDestinations);

router.get(
    "/explain/destination/:id",
    recommendController.explainRecommendation
);

module.exports = router;