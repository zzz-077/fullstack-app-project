import jwt from "jsonwebtoken";
import createATokenWithRToken from "../utils/createATokenWithRToken.js";
async function tokenAutentication(req, res, next) {
  const AccessToken = req.cookies.AccessToken;
  const RefreshToken = req.cookies.RefreshToken;
  if (!AccessToken) {
    if (!RefreshToken) {
      return res.status(401).json({
        status: "fail",
        message: "Autenticated failed",
        error: null,
        data: [],
      });
    }
    await createATokenWithRToken(req, res, RefreshToken, next);
  } else {
    // console.log("AccessToken=", req.cookies.AccessToken);
    // console.log("RefreshToken=", req.cookies.RefreshToken);
    jwt.verify(AccessToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) {
        return res.status(403).json({
          status: "fail",
          message: "Invalid Access token",
          error: err,
          data: [],
        });
      }
      next();
    });
  }
}
export default tokenAutentication;
