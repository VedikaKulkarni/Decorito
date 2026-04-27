const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/auth");

// Route to get chat history for a specific room
router.get("/chat/:roomId", authMiddleware, chatController.getChatHistory);

module.exports = router;
