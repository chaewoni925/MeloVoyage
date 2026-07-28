const express = require("express");
const router = express.Router();

const destinationController = require("../controllers/destinationController");

// search가 /:id보다 먼저 등록되어야 함
router.get("/search", destinationController.searchDestinations);
router.get("/", destinationController.getAllDestinations);
router.get("/:id", destinationController.getDestinationById);
router.post("/import", destinationController.importDestinations);

module.exports = router;