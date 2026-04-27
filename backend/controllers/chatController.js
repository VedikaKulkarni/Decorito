const Chat = require("../models/Chat");

exports.getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    // We could add validation to ensure the requesting user is either the buyer or shopkeeper
    
    const chats = await Chat.find({ roomId }).sort({ createdAt: 1 });
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
