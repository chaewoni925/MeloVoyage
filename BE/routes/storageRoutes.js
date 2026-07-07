const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");
const storageController = require("../controllers/storageController");

router.post("/playlists", protect, storageController.savePlaylist);
router.get("/playlists", protect, storageController.getPlaylists);
router.get("/playlists/:id", protect, storageController.getPlaylistById);
router.delete("/playlists/:id", protect, storageController.deletePlaylist);

module.exports = router;