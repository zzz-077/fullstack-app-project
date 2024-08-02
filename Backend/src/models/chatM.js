import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        chatName: { type: String, required: true },
        participants: { type: [String], required: true },
    },
    {
        collection: "Chats",
        timestamps: true,
        read: "nearest",
    }
);

const Chat = mongoose.model("chat", chatSchema);

export default Chat;
