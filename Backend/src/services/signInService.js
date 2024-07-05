import User from "../models/userM.js";
import bcrypt from "bcrypt";
async function signIn(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const userData = await User.findOne({ email: email });
    const comparePass = await bcrypt.compare(password, userData.password);
    if (userData.length === 0 || !comparePass)
      return res.status(404).json({
        status: "fail",
        message: "No user found!",
        error: null,
        data: [],
      });
    return res.status(200).json({
      status: "success",
      message: "User data found successfully!",
      error: null,
      data: [userData],
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "User data get failed!",
      error: error,
    });
  }
}

export default signIn;
