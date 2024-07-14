import jwt from "jsonwebtoken";
async function createAccessTokenCookie(res, AccessToken) {
  return res.cookie("AccessToken", AccessToken, {
    httpOnly: true,
    maxAge: 1 * 3600 * 1000,
  });
}

export { createAccessTokenCookie };
