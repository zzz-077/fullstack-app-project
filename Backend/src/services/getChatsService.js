import Chat from "../models/chatM.js";
import jwt from "jsonwebtoken";

export default async function getChats(req, res) {
  const AccessToken = req.cookies.AccessToken;

  try {
    jwt.verify(
      AccessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(404).json({
            status: "fail",
            message: "Don't have access on user!",
            error: err,
            data: [],
          });
        } else {
          const userId = decoded.userId;
          if (userId === "" || !userId)
            return res.status(404).json({
              status: "fail",
              message: "Don't have access on UserData!",
              error: null,
              data: [],
            });
          const chatData = await Chat.find({
            participants: { $all: [userId] },
          });
          console.log(chatData);
          if (!chatData)
            return res.status(404).json({
              status: "fail",
              message: "Can't found chats!",
              error: null,
              data: [],
            });
          return res.status(200).json({
            status: "success",
            message: "Chats received successfully!",
            error: null,
            data: chatData,
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Receive chats failed!",
      error: error,
      data: [],
    });
  }
}
