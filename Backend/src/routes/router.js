import express from "express";
import usersRoute from "./usersRoute.js";
import authRoute from "./authRoute.js";
import homeRoute from "./homeRoute.js";
import tokenAutentication from "../middleware/tokenAutentication.js";
import User from "../models/userM.js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.use("/", usersRoute);
router.use("/auth", authRoute);
router.use("/home", tokenAutentication, homeRoute);
router.post("/logout", async (req, res) => {
  const AccessToken = req.cookies.AccessToken;
  console.log(AccessToken);
  try {
    jwt.verify(
      AccessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          console.log("Don't have access on user!");
        } else {
          const userId = decoded.userId;
          if (userId === "" || !userId)
            console.log("Don't have access on UserData!");
          const userData = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { status: false } },
            { new: true }
          );
          // console.log("==========LOG2==========");
          // console.log(userData);
        }
      }
    );
    res.clearCookie("AccessToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      path: "/",
    });
    res.clearCookie("RefreshToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      path: "/",
    });
    res.status(200).json({
      status: "success",
      message: "Logout successfully",
      error: null,
      data: [],
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Logout failed",
      error: error,
      data: [],
    });
  }
});

export default router;
