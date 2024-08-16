import express from "express";
import { friendRequest, acceptRequest } from "../services/friendAddService.js";
import GetUserData from "../services/userGetDataService.js";
const router = express.Router();

router.post("/", GetUserData);
router.post("/friendAddRequest", friendRequest);
router.post("/acceptFriendRequest", acceptRequest);

export default router;
