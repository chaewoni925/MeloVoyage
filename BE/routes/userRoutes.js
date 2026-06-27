const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/mypage", userController.getMyPage);
router.patch("/mypage", userController.updateMyPage);

module.exports = router;