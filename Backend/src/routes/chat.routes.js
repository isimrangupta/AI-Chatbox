const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const chatController = require("../controllers/chat.controller")

const router = express.Router();

router.get(
  "/",
  authMiddleware.authUser,
  chatController.getChats
);

router.post(
  "/",
  authMiddleware.authUser,
  chatController.createChat
);

router.delete(
  "/:chatId",
  authMiddleware.authUser,
  chatController.deleteChat
);


module.exports = router;