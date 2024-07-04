import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./src/routes/router.js";
dotenv.config();
const app = express();
app.use(express.json());
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
