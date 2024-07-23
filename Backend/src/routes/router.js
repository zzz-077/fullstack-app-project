import express from "express";
import usersRoute from "./usersRoute.js";
import authRoute from "./authRoute.js";
import tokenAutentication from "../middleware/tokenAutentication.js";
const router = express.Router();

router.use("/", usersRoute);
router.use("/auth", authRoute);
router.get("/home", tokenAutentication, (req, res) => {});
router.get("/logout", (req, res, next) => {
    res.clearCookie("AccessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    });
    res.clearCookie("RefreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    });
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
        error: null,
        data: [],
    });
});

export default router;
