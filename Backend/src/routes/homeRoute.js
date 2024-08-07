import express from "express";
import friendRequest from "../services/friendAddService.js";
const router = express.Router();

router.post("/", (req, res) => {
    console.log("works");

    try {
        res.status(200).json({
            status: "success",
            message: "Autenticated successfully",
            error: null,
            data: [],
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Autenticated failed",
            error: error,
            data: [],
        });
    }
});
router.post("/friendAddRequest", friendRequest);

export default router;
