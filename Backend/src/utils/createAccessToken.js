import jwt from "jsonwebtoken";
import dotendv from "dotenv";
dotendv.config();

async function createAccessToken(userId) {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10s",
  });
}
async function createRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
}
export { createAccessToken, createRefreshToken };
