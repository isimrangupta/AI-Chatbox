const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const messageModel = require("../models/message.model");

const router = express.Router();

router.get("/:chatId", authMiddleware.authUser, async (req, res) => {
  const { chatId } = req.params;
  const messages = await messageModel
    .find({ chat: chatId })
    .sort({ createdAt: 1 });

  res.status(200).json({ messages });
});

module.exports = router;