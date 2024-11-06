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
    failureRedirect: `chatz-prj.netlify.app:${process.env.FRONT_PORT}/signin`,
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
    return res.redirect(`chatz-prj.netlify.app:${process.env.FRONT_PORT}/home`);
  },
  (err, req, res, next) => {
    // return res.status(500).json({
    //     status: "fail",
    //     message: "Authentication failed",
    //     error: err.message,
    // });
    res.redirect(`chatz-prj.netlify.app:${process.env.FRONT_PORT}/signin`);
  }
);

export default router;
