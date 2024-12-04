import express from "express";
import passport from "passport";
import {
  createAccessToken,
  createRefreshToken,
} from "../utils/createAccessToken.js";
import {
  createAccessTokenCookie,
  createRefreshTokenCookie,
} from "../utils/cookiesUtils.js";
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
    failureRedirect: `https://chatz-prj.vercel.app/signin`,
    session: false,
  }),
  async (req, res) => {
    const AccessToken = await createAccessToken(req.user._id);
    const RefreshToken = await createRefreshToken(req.user._id);
    await createAccessTokenCookie(res, AccessToken);
    await createRefreshTokenCookie(res, RefreshToken);
    // return res.status(200).json({
    //     status: "success",
    //     message: "Authentication success",
    //     error: null,
    // });
    return res.redirect(`https://chatz-prj.vercel.app/home`);
  },
  (err, req, res, next) => {
    // return res.status(500).json({
    //     status: "fail",
    //     message: "Authentication failed",
    //     error: err.message,
    // });
    res.redirect(`https://chatz-prj.vercel.app/signin`);
  }
);

export default router;
