import { trusted } from "mongoose";
import Chat from "../models/chatM.js";
import Message from "../models/messageM.js";
import User from "../models/userM.js";

async function deletechat(req, res) {
  const chatId = req.body?.chatId;
  const participants = req.body?.participants;
  const removedFriendIDFromChat = req.body?.userId;
  console.log(removedFriendIDFromChat);
  try {
    if (Array.isArray(participants)) {
      if (participants.length === 2 && removedFriendIDFromChat === "") {
        const foundedChat = await Chat.findOneAndDelete({ _id: chatId });
        if (!foundedChat)
          return res.status(404).json({
            status: "fail",
            message: "Can not find chat!",
            error: null,
            data: [],
          });

        for (const idLoop1 of participants) {
          const updateUserFriends = await User.findOneAndUpdate(
            { _id: idLoop1 },
            {
              $pull: {
                friends: { $in: participants.filter((id) => id !== idLoop1) },
              },
            },
            { new: true }
          );
          if (!updateUserFriends) {
            return res.status(404).json({
              status: "fail",
              message: "Cannot find user or update friends array!",
              error: null,
              data: [],
            });
          }

          const DeletedMessages = await Message.deleteMany({ chatId: chatId });
          // we don't need to check if there is not messages, because it might be new chat without any message so it doesn't have to return error status
          // if (DeletedMessages.deletedCount === 0)
          //   return res.status(404).json({
          //     status: "fail",
          //     message: "Can not find messages!",
          //     error: null,
          //     data: [],
          //   });
        }
      } else if (participants.length > 2 && removedFriendIDFromChat !== "") {
        const updateedChat = await Chat.findOneAndUpdate(
          { _id: chatId },
          { $pull: { participants: removedFriendIDFromChat } },
          { new: true }
        );
        if (!updateedChat)
          return res.status(404).json({
            status: "fail",
            message: "Can not find user in chat!",
            error: null,
            data: [],
          });
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
