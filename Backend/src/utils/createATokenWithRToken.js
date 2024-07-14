import jwt from "jsonwebtoken";
import { createAccessToken } from "../utils/createAccessToken.js";
import { createAccessTokenCookie } from "../utils/cookiesUtils.js";

async function createATokenWithRToken(req, res, RefreshToken) {
  await jwt.verify(
    RefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decode) => {
      if (err) {
        return res.status(403).json({
          status: "fail",
          message: "Invalid Refresh token",
          error: err,
        });
      }
      const userId = decode.userId;
      const AccessToken = await createAccessToken(userId);
      await createAccessTokenCookie(res, AccessToken);
    }
  );
}

export default createATokenWithRToken;
