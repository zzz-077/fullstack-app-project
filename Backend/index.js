import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import router from "./src/routes/router.js";
import cookieParser from "cookie-parser";
import User from "./src/models/userM.js";
import "./auth.js";
dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

//coockieParser
app.use(cookieParser());
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

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
