import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./src/models/userM.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const randomHexPass = await crypto.randomBytes(3).toString("hex");
          const hashedPass = bcrypt.hashSync(randomHexPass, 10);
          user = await User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            img: profile.photos[0].value,
            password: hashedPass,
          }).save();
          console.log(user);
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
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
