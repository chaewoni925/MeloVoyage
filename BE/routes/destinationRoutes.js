const express = require("express");
const router = express.Router();

const destinationController = require("../controllers/destinationController");

router.get("/search", destinationController.searchDestination);
router.post("/import", destinationController.importDestinations);
router.get("/search", destinationController.searchDestinations);
router.get("/reviews/:placeId", destinationController.getDestinationReviews);
router.get("/", destinationController.getAllDestinations);
router.get("/:id", destinationController.getDestinationById);

module.exports = router;