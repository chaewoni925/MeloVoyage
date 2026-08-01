const express = require("express");
const router = express.Router();
const savedDestinationController = require("../controllers/savedDestinationController");
const protect = require("../middlewares/auth");

router.get("/search", savedDestinationController.searchAndPrepare);
router.get("/destinations/saved", protect, savedDestinationController.getSaved);
router.post("/destinations/:id/save", protect, savedDestinationController.save);
router.delete("/destinations/:id/save", protect, savedDestinationController.unsave);

module.exports = router;