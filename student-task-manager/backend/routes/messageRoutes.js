const express = require("express");
const router = express.Router();
const { getMessages, createMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getMessages).post(createMessage);

module.exports = router;
