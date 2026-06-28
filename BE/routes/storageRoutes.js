const express = require("express");
const router = express.Router();

const storageController = require("../controllers/storageController");

router.post("/playlists", storageController.savePlaylist);
router.get("/playlists", storageController.getPlaylists);
router.get("/playlists/:id", storageController.getPlaylistById);
router.delete("/playlists/:id", storageController.deletePlaylist);

module.exports = router;