const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");
const chatModel = require("../models/chat.model");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
   cors: {
      origin: ["http://localhost:5173", "https://ai-chatbox-ruby.vercel.app"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");


  const token = cookies.token || socket.handshake.auth?.token;

    
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayLoad) => {
      try {
        console.log(messagePayLoad);

        const [message, vectors] = await Promise.all([
          messageModel.create({
            chat: messagePayLoad.chat,
            user: socket.user._id,
            content: messagePayLoad.content,
            role: "user",
          }),
          aiService.generateVector(messagePayLoad.content),
        ]);

        await chatModel.findByIdAndUpdate(messagePayLoad.chat, {
          lastActivity: new Date(),
        });

        await createMemory({
          vectors,
          messageId: message._id,
          metadata: {
            chat: messagePayLoad.chat,
            user: socket.user._id,
            text: messagePayLoad.content,
          },
        });

        const [memory, chatHistory] = await Promise.all([
          queryMemory({
            queryVector: vectors,
            limit: 3,
            metadata: {
              user: String(socket.user._id),
              chat: String(messagePayLoad.chat),
            },
          }),
          messageModel
            .find({ chat: messagePayLoad.chat })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean()
            .then((messages) => messages.reverse()),
        ]);

        const stm = chatHistory.map((item) => ({
          role: item.role,
          parts: [{ text: item.content }],
        }));

        const ltm = [
          {
            role: "user",
            parts: [
              {
                text: `these are some previous messages from the chat, use them to generate a response\n${memory.map((item) => item.metadata.text).join("\n")}`,
              },
            ],
          },
        ];

        const response = await aiService.generateResponse([...ltm, ...stm]);

        socket.emit("ai-response", {
          content: response,
          chat: messagePayLoad.chat,
        });

        const [responseMessage, responseVectors] = await Promise.all([
          messageModel.create({
            chat: messagePayLoad.chat,
            user: socket.user._id,
            content: response,
            role: "model",
          }),
          aiService.generateVector(response),
        ]);

        await chatModel.findByIdAndUpdate(messagePayLoad.chat, {
          lastActivity: new Date(),
        });

        await createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            chat: messagePayLoad.chat,
            user: socket.user._id,
            text: response,
          },
        });
      } catch (error) {
        console.log("SOCKET ERROR:", error);
        socket.emit("ai-error", { message: error.message });
      }
    });
  });
}

module.exports = initSocketServer;
