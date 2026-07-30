const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");
const onboardingController = require("../controllers/onboardingController");

router.get("/genres", protect, onboardingController.getAvailableGenres);
router.get("/artists", protect, onboardingController.getAvailableArtists);
router.get("/preferences", protect, onboardingController.getPreferences);
router.post("/preferences", protect, onboardingController.createPreferences);
router.patch("/preferences", protect, onboardingController.updatePreferences);

module.exports = router;