import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String },
    participants: { type: [String], required: true },
    isGroupChat: { type: Boolean, required: false },
  },
  {
    collection: "Chats",
    timestamps: true,
    read: "nearest",
  }
);

const Chat = mongoose.model("chat", chatSchema);

export default Chat;
