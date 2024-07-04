import express from "express";
import usersRoute from "./usersRoute.js";
const router = express.Router();

router.use("/user", usersRoute);

export default router;
