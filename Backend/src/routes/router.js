import express from "express";
import usersRoute from "./usersRoute.js";
import authRoute from "./authRoute.js";
import homeRoute from "./homeRoute.js";
import tokenAutentication from "../middleware/tokenAutentication.js";
const router = express.Router();

router.use("/", usersRoute);
router.use("/auth", authRoute);
router.use("/home", tokenAutentication, homeRoute);
router.post("/logout", (req, res) => {
  try {
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
