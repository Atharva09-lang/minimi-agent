import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Authenticated user",
        user:{
            id: req.user.id
        }
    });
});

export default router;