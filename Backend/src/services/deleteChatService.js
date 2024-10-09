import Chat from "../models/chatM.js";
import Message from "../models/messageM.js";
import User from "../models/userM.js";

async function deletechat(req, res) {
  const { chatId, participants } = req.body;

  try {
    const foundedChat = await Chat.findOneAndDelete({ _id: chatId });
    console.log(foundedChat);
    if (!foundedChat)
      return res.status(404).json({
        status: "fail",
        message: "Can not find chat!",
        error: null,
        data: [],
      });
    await Message.deleteMany({ chatId: chatId });

    if (Array.isArray(participants)) {
      console.log("log1");
      for (const idLoop1 of participants) {
        console.log("idloop1", idLoop1);
        for (const idLoop2 of participants) {
          console.log("idloop2", idLoop2);
          if (idLoop1 !== idLoop2) {
            const updateUserFriends = await User.findOneAndUpdate(
              idLoop1,
              {
                $pull: { friends: idLoop2 },
              },
              { new: true }
            );
            console.log("====================");
            console.log(updateUserFriends);
            if (!updateUserFriends)
              return res.status(404).json({
                status: "fail",
                message: "Can not find friend in user's friends!",
                error: null,
                data: [],
              });
          }
        }
      }
    }
    return res.status(200).json({
      status: "success",
      message: "Chat and related data successfully deleted",
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Delete chat failed!",
      error: error,
      data: [],
    });
  }
}

export default deletechat;
