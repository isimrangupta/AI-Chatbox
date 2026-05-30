const messageModel = require("../models/message.model");

async function getMessages(req, res) {
  const { chatId } = req.params;

  const messages = await messageModel
    .find({
      chat: chatId,
    })
    .sort({ createdAt: 1 });

  res.status(200).json({
    messages,
  });
}

module.exports = {
  getMessages,
};