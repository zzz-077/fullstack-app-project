import Chat from "../models/chatM.js";

export default async function createChat(req, res) {
  // there also must be userId as friendIdes
  const groupIds = req.body.friendids;

  try {
    await Chat.create({
      chatName: "",
      participants: [groupIds],
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "create chat group failed!",
      error: error,
      data: [],
    });
  }
}
