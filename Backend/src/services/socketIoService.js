import jwt from "jsonwebtoken";
import User from "../models/userM.js";
import Message from "../models/messageM.js";
function handleSocketConnection(io, socket) {
  const token = socket.handshake.headers.cookie
    ?.split(";")
    ?.find((cookie) => cookie.startsWith("AccessToken="))
    ?.split("=")[1];
  Tokenverify(token, true);
  // console.log("||||||0|||||||");
  // console.log(token);
  console.log("A user connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`user ${socket.id}  joined in chat: ${chatId}`);
  });
  socket.on("sendMessage", async (chatId, senderId, message) => {
    // sents message on status pending before fully senting message data like send time and so on
    socket.emit("receivedMessage", {
      chatId,
      senderId,
      message,
      status: "pending",
    });
    try {
      if (!chatId || !senderId || !message) {
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
        message,
      }).save();
      socket.emit("receivedMessage", {
        ...receivedMessage?._doc,
        status: "sent",
      });
      socket.brodcast.to(chatId).emit("receivedMessageInChat", receivedMessage);
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
    // console.log("||||||1|||||||");
    Tokenverify(token, false);
  });
  socket.on("disconnect", () => {
    if (!token) {
      console.log("No token found in cookies.");
      return;
    }
    setTimeout(() => {
      Tokenverify(token, false);
    }, 5000);
    // console.log("||||||2|||||||");
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
      const userData = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { status: status } },
        { new: true }
      );
    }
  });
}
export default handleSocketConnection;
