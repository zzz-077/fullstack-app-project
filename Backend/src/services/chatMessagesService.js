import Message from "../models/messageM.js";
async function getChatMessages(req, res) {
  const { chatId } = req.body;
  try {
    const chatData = await Message.aggregate([
      { $match: { chatId: chatId } },
      { $sort: { createdAt: 1 } },
    ]);
    console.log(chatData);
    if (!chatData || chatData.length === 0)
      return res.status(404).json({
        status: "fail",
        message: "No Chat Data!",
        error: null,
        data: [],
      });

    return res.status(200).json({
      status: "success",
      message: "Chat message got successfully!",
      error: null,
      data: chatData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Chat message get failed!",
      error: error,
      data: [],
    });
  }
}

export default getChatMessages;
