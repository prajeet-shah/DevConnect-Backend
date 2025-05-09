const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const secretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeServer = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = secretRoomId(userId, targetUserId);
      console.log(firstName + " joined the room : ", roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const roomId = secretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, text });
        } catch (err) {
          console.error("Error handling sendMessage event:", err.message);
        }
      }
    );
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

module.exports = initializeServer;
