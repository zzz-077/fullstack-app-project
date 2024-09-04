import Chat from "../models/chatM.js";

async function getChatData(req, res) {
  try {
    const chatData = await Chat.find({
      participants: { $all: [req.body.userId, req.body.friendId] },
    });
    if (!chatData || chatData.length === 0)
      return res.status(404).json({
        status: "fail",
        message: "Chat data not found!",
        error: null,
        data: [],
      });

    return res.status(200).json({
      status: "success",
      message: " Chat data successfully!",
      error: null,
      data: chatData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Find chat data failed!",
      error: error,
      data: [],
    });
  }
}

export default getChatData;
