import express from "express";
import { getUser,updateUserDetails } from "../controllers/userController";

const router = express.Router();

router.get("/:id", getUser);
router.put("/:id", updateUserDetails);

export default router;