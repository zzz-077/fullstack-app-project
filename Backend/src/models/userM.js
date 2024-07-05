import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    img: { type: String },
    googleId: { type: String, unique: true },
  },
  {
    collection: "Users",
    timestamps: true,
    read: "nearest",
  }
);

const User = mongoose.model("user", userSchema);

export default User;
