const express = require("express");
const router = express.Router();

const onboardingController = require("../controllers/onboardingController");

router.get("/preferences", onboardingController.getPreferences);
router.post("/preferences", onboardingController.createPreferences);
router.patch("/preferences", onboardingController.updatePreferences);

module.exports = router;