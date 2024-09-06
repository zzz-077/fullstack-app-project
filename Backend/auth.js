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
        let user = await User.findOneAndUpdate(
          { googleId: profile.id },
          { $set: { status: true } },
          { new: true }
        );
        if (!user) {
          const randomHexPass = await crypto.randomBytes(3).toString("hex");
          const hashedPass = bcrypt.hashSync(randomHexPass, 10);
          user = await User({
            googleId: profijle.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            img: profile.photos[0].value,
            password: hashedPass,
          }).save();
        } else {
          return done(null, user);
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
