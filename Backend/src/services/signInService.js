import User from "../models/userM.js";
import bcrypt from "bcrypt";
import {
  createAccessToken,
  createRefreshToken,
} from "../utils/createAccessToken.js";
import {
  createAccessTokenCookie,
  createRefreshTokenCookie,
} from "../utils/cookiesUtils.js";
async function signIn(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const userData = await User.findOneAndUpdate(
      { email: email },
      { $set: { status: true } },
      { new: true }
    );
    const comparePass = await bcrypt.compare(password, userData.password);
    if (userData.length === 0 || !comparePass || userData.googleId)
      return res.status(404).json({
        status: "fail",
        message: "No user found!",
        error: null,
        data: [],
      });
    const AccessToken = await createAccessToken(userData._id);
    const RefreshToken = await createRefreshToken(userData._id);
    await createAccessTokenCookie(res, AccessToken);
    await createRefreshTokenCookie(res, RefreshToken);
    // console.log(userData);

    return res.status(200).json({
      status: "success",
      message: "User signed successfully!",
      error: null,
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "User signed failed!",
      error: error,
      data: [],
    });
  }
}

export default signIn;
