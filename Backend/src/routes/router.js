import express from "express";
import usersRoute from "./usersRoute.js";
import authRoute from "./authRoute.js";
import checkAutentication from "../middleware/app.js";
const router = express.Router();

router.use("/user", usersRoute);
router.use("/auth", authRoute);
router.get("/home", checkAutentication, (req, res) => {
  res.send("Home page");
});
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        status: "fail",
        message: "User logout failed!",
        error: err.message,
      });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          status: "fail",
          message: "Session destruction failed!",
          error: err.message,
        });
      }
      res.redirect("user/signin");
    });
  });
});

export default router;
