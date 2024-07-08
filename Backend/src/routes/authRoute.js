import express from "express";
import passport from "passport";
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "user/signin" }),
  (req, res) => {
    res.redirect("/home");
  },
  (err, req, res, next) => {
    res.status(500).json({
      status: "fail",
      message: "Authentication failed",
      error: err.message,
    });
  }
);

export default router;
