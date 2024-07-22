import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import router from "./src/routes/router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./auth.js";
dotenv.config();
const app = express();

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
        app.listen(process.env.PORT, (port) => {
            return console.log("Listening on port:", process.env.PORT + "!");
        });
    })
    .catch((error) => {
        console.log("Error occurred while connecting to database", error);
    });
