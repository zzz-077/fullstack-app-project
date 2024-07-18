import jwt from "jsonwebtoken";
import { createAccessToken } from "../utils/createAccessToken.js";
import { createAccessTokenCookie } from "../utils/cookiesUtils.js";

async function createATokenWithRToken(req, res, RefreshToken, next) {
  jwt.verify(RefreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: "fail",
        message: "Invalid Refresh token",
        error: err,
        data: [],
      });
    }
    const userId = decoded.userId;
    const AccessToken = createAccessToken(userId);
    createAccessTokenCookie(res, AccessToken);
    next();
  });
}

export default createATokenWithRToken;
