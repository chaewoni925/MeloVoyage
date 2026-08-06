const express = require("express");
const router = express.Router();
const music = require("../controllers/music");
const protect = require("../middlewares/auth");

router.get("/mine", protect, music.getMyMusic);
router.get("/popular", music.getPopularTracks);


module.exports = router;