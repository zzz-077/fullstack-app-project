import express from "express";
import passport from "passport";
import { createAccessToken } from "../utils/createAccessToken.js";
import { createAccessTokenCookie } from "../utils/cookiesUtils.js";
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "user/signin",
    session: false,
  }),
  async (req, res) => {
    console.log("WORKS");
    const AccessToken = await createAccessToken(req.user._id);
    await createAccessTokenCookie(res, AccessToken);
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
