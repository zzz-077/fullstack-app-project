import express from "express";
import usersGet from "../services/usersGetService.js";
import userCreate from "../services/userCreateService.js";

const router = express.Router();

router.get("/usersget", usersGet);
router.post("/userCreate", userCreate);

export default router;
