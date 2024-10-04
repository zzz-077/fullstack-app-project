import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    collection: "Messages",
    timestamps: true,
    read: "nearest",
  }
);

const Message = mongoose.model("message", messageSchema);

export default Message;
