import jwt from "jsonwebtoken";
import createATokenWithRToken from "../utils/createATokenWithRToken.js";
async function tokenAutentication(req, res, next) {
  const AccessToken = req.cookies.AccessToken;
  const RefreshToken = req.cookies.RefreshToken;
  if (!AccessToken) {
    if (!RefreshToken) {
      return res.redirect("/signIn");
    }
    await createATokenWithRToken(req, res, RefreshToken, next);
  } else {
    jwt.verify(AccessToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) {
        return res.status(403).json({
          status: "fail",
          message: "Invalid Access token",
          error: err,
        });
      }
      next();
    });
  }
}
export default tokenAutentication;
