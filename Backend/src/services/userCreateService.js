import User from "../models/userM.js";
import bcrypt from "bcrypt";
async function userCreate(req, res) {
  try {
    const hashedpass = await bcrypt.hash(req.body.password, 10);
    console.log(hashedpass);
    req.body.password = hashedpass;
    const usersData = await User(req.body).save();

    return res.status(200).json({
      status: "success",
      message: "User data created successfully!",
      error: null,
      data: usersData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "User data create failed!",
      error: error,
    });
  }
}

export default userCreate;
