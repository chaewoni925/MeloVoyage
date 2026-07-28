const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");
const storageController = require("../controllers/storageController");
const spotifyController = require("../controllers/spotify");

router.post("/save", protect, storageController.savePlaylist);
router.get("/", protect, storageController.getPlaylists);
router.get("/:id", protect, storageController.getPlaylistById);
router.delete("/:id", protect, storageController.deletePlaylist);
router.post("/:id/export/spotify", protect, spotifyController.exportToSpotify);
// POST /storage/:id/export/spotify

module.exports = router;