import express from "express";
import passport from "passport";
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
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
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/signin");
  });
});

export default router;
