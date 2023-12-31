import express from "express";
import {
    register,
    authenticateUser,
    logoutUser,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", authenticateUser);
router.post("/logout", logoutUser);

export default router;