import Chat from "../models/chatM.js";

export default async function createChat(req, res) {
  const groupIds = req.body.chatIds;
  const chatName = req.body.chatName;
  try {
    await Chat.create({
      chatName: chatName,
      participants: groupIds,
      isGroupChat: true,
    });
    return res.status(200).json({
      status: "success",
      message: "Created chat group!",
      error: null,
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Create chat group failed!",
      error: error,
      data: [],
    });
  }
}
