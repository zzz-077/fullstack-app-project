import express from "express";
import { friendRequest, acceptRequest } from "../services/friendAddService.js";
import GetUserData from "../services/userGetDataService.js";
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

export default router;
