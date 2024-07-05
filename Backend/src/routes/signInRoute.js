import express from "express";
import signIn from "../services/signInService.js";
const router = express.Router();

router.get("/", signIn);

export default router;
