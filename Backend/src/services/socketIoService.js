import jwt from "jsonwebtoken";
import User from "../models/userM.js";
import Message from "../models/messageM.js";
function handleSocketConnection(io, socket) {
  console.log(
    "===================================================================="
  );
  const token = socket.handshake.headers.cookie
    ?.split(";")
    .find((cookie) => {
      if (cookie.slice(0, 7) === " Access" || cookie.slice(0, 6) === "Access") {
        return cookie;
      }
    })
    ?.split("=")[1];
  console.log(token);
  // console.log(token);
  // console.log("A user connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    // console.log(`user ${socket.id}  joined in chat: ${chatId}`);
  });
  socket.on("sendMessage", async (chatId, senderId, senderName, message) => {
    // sents message on status pending before fully senting message data like send time and so on
    socket.emit("receivedMessage", {
      chatId,
      senderId,
      senderName,
      message,
      status: "pending",
    });
    try {
      if (!chatId || !senderId || !senderName || !message) {
        socket.emit("receivedMessage", {
          status: "fail",
          message: "Missing required fields!",
          error: null,
          data: [],
        });
      }
      const receivedMessage = await Message({
        chatId,
        senderId,
        senderName,
        message,
      }).save();
      socket.emit("receivedMessage", {
        ...receivedMessage?._doc,
        status: "sent",
      });
      socket.broadcast
        .to(chatId)
        .emit("receivedMessageInChat", receivedMessage);
    } catch (error) {
      socket.emit("receivedMessage", {
        status: "fail",
        message: "Message send failed!",
        error: error.message,
        data: [],
      });
    }
  });
  socket.on("logout", () => {
    if (!token) {
      console.log("No token from coockies.");
      return;
    }
    console.log("||||||1|||||||");
    Tokenverify(token, false);
  });
  socket.on("disconnect", () => {
    if (!token) {
      console.log("No token found in cookies.");
      return;
    }
    console.log("||||||2|||||||");
    Tokenverify(token, false);
    console.log("user disconnected:", socket.id);
  });
}

function Tokenverify(token, status) {
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.log("Don't have access on user!");
    } else {
      const userId = decoded.userId;
      if (userId === "" || !userId)
        console.log("Don't have access on UserData!");
      console.log("STATUS", status);
      await User.findOneAndUpdate(
        { _id: userId },
        { $set: { status: status } }
      );
    }
  });
}
export default handleSocketConnection;
