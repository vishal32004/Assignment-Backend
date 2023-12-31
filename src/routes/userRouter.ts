import express from "express";
import { getUser,updatePassword,updateUserDetails } from "../controllers/userController";

const router = express.Router();

router.get("/:id", getUser);
router.put("/:id", updateUserDetails);
router.put("/:id/password",updatePassword)

export default router;