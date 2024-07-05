import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import router from "./src/routes/router.js";
import "./auth.js";
dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());
//default rout
app.use("/", router);

// Session setup
app.use(
  session({
    secret: "notmysecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

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
