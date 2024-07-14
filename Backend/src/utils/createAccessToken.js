import jwt from "jsonwebtoken";
import dotendv from "dotenv";
dotendv.config();

async function createAccessToken(userId) {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });
}
export { createAccessToken };
