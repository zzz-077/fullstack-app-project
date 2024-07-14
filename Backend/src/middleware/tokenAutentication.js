import jwt from "jsonwebtoken";
import createATokenWithRToken from "../utils/createATokenWithRToken.js";
async function tokenAutentication(req, res, next) {
  const AccessToken = req.cookies.AccessToken || req.header("AccessToken");
  const RefreshToken = req.cookies.RefreshToken || req.header("RefreshToken");
  if (!AccessToken) {
    if (!RefreshToken) {
      res.redirect("/user/signIn");
      return res.status(403).json({
        status: "fail",
        message: "Refresh token is required!",
        error: null,
      });
      await createATokenWithRToken(req, res, RefreshToken);
      next();
    }
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
  res.redirect("user/signin");
}
export default tokenAutentication;
