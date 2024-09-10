import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import router from "./src/routes/router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import "./auth.js";
import handleSocketConnection from "./src/services/socketIoService.js";
dotenv.config();
const app = express();
const server = http.createServer(app);

//socketIo
export const io = new Server(server, {
  cors: {
    origin: `http://localhost:${process.env.FRONT_PORT}`,
    credentials: true,
  },
});
io.use(async (socket, next) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie || "");
  const AccessToken = cookies.AccessToken;
  const RefreshToken = cookies.RefreshToken;
  if (!AccessToken) {
    if (!RefreshToken)
      return next(new Error("Authentication failed, no tokens provided"));
  } else {
    jwt.verify(AccessToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) return next(new Error("Invalid Access token"));

      next();
    });
  }
});
io.on("connection", (socket) => handleSocketConnection(io, socket));
// Enable CORS
app.use(
  cors({
    origin: `http://localhost:${process.env.FRONT_PORT}`,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
  })
);
// Middleware to parse JSON
app.use(express.json());
app.use(express.text());
//coockieParser
app.use(cookieParser());
app.use(passport.initialize());
//default rout
app.use("/", router);
//connecting to database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database saccessfully!");
    server
      .listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
      })
      .on("error", (err) => {
        console.error("Server error:", err);
      });
  })
  .catch((error) => {
    console.log("Error occurred while connecting to database", error);
  });
