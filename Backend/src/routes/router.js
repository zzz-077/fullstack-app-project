import express from "express";
import usersRoute from "./usersRoute.js";
import signInRoute from "./signInRoute.js";
import authRoute from "./authRoute.js";
const router = express.Router();

router.use("/user", usersRoute);
router.use("/signin", signInRoute);
router.use("/auth", authRoute);
router.get("/home", (req, res) => {
  res.send("Home page");
});

export default router;
