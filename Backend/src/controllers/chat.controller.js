const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model")


async function createChat(req,res) {
    const {title} = req.body;

    const user = req.user;

    const chat = await chatModel.create({
        user: user._id,
        title
    });

    res.status(201).json({
        message: "Chat created successfully",
        chat:{
            _id:chat._id,
            title:chat.title,
            lastActivity:chat.lastActivity,
            user:chat.user
        }
    });
}

async function getChats(req, res) {
  const chats = await chatModel
    .find({
      user: req.user._id,
    })
    .sort({ lastActivity: -1 });

  res.status(200).json({
    chats,
  });
}

async function deleteChat(req, res) {
  const { chatId } = req.params;

  await messageModel.deleteMany({
    chat: chatId,
  });

  await chatModel.findByIdAndDelete(chatId);

  res.status(200).json({
    message: "Chat deleted successfully",
  });
}


module.exports = {
    createChat,
    getChats,
    deleteChat,
}