import express from "express";
import usersGet from "../services/usersGetService.js";
import userCreate from "../services/userCreateService.js";
import signIn from "../services/signInService.js";
const router = express.Router();

router.get("/usersget", usersGet);
router.post("/signup", userCreate);
router.post("/signin", signIn);

export default router;
