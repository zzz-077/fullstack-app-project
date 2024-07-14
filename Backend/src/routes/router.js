import express from "express";
import usersRoute from "./usersRoute.js";
import authRoute from "./authRoute.js";
import checkAutentication from "../middleware/app.js";
const router = express.Router();

router.use("/user", usersRoute);
router.use("/auth", authRoute);
router.get("/home", (req, res) => {
  res.send("Home page");
});
router.get("/logout", (req, res, next) => {
  res.clearCookie("AccessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.redirect("user/signin");
});

export default router;
