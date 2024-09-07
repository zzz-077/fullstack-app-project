import jwt from "jsonwebtoken";
import User from "../models/userM.js";
function handleSocketConnection(io, socket) {
  const token = socket.handshake.headers.cookie
    ?.split(";")
    ?.find((cookie) => cookie.startsWith("AccessToken="))
    ?.split("=")[1];
  Tokenverify(token, true);
  console.log("||||||0|||||||");
  console.log(token);
  console.log("A user connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`user ${socket.id}  joined in chat: ${chatId}`);
  });

  socket.on("logout", () => {
    if (!token) {
      console.log("No token found in cookies.");
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
    setTimeout(() => {
      Tokenverify(token, false);
    }, 5000);
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
