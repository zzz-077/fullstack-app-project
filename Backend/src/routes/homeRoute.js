import express from "express";
import { friendRequest, acceptRequest } from "../services/friendAddService.js";
import getFriendData from "../services/getFriendDataService.js";
import GetUserData from "../services/userGetDataService.js";
import getChatData from "../services/getChatDataService.js";
import getChatMessages from "../services/chatMessagesService.js";
import createChat from "../services/createChatService.js";
const router = express.Router();

router.post("/", (req, res) => {
  try {
    return res.status(200).json({
      status: "success",
      message: "User joined successfully!",
      error: null,
      data: [],
    });
  } catch (error) {
    return res.status(200).json({
      status: "fail",
      message: "User joined unsuccessfully!",
      error: null,
      data: [],
    });
  }
});
router.post("/UserData", GetUserData);
router.post("/friendAddRequest", friendRequest);
router.post("/acceptFriendRequest", acceptRequest);
router.post("/getFriendData", getFriendData);
router.post("/getChatData", getChatData);
router.post("/getChatmessages", getChatMessages);
router.post("/createChat", createChat);

export default router;
