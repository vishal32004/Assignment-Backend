import express from "express";
import {
    registerUser,
    authenticateUser,
    logoutUser,
} from "../controllers/authController";

const router = express.Router();

router.post("/registerNewUser", registerUser);
router.post("/login", authenticateUser);
router.post("/logout", logoutUser);

export default router;