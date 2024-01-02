import express from "express";
import { getUser, updatePassword, updateUserDetails,getUsers } from "../controllers/userController";
import { authorize } from "../middleware/authMiddleware";
import { Roles } from "../constants";

const router = express.Router();

router.get("/:id", authorize([Roles.User, Roles.Admin]), getUser);
router.get("/", authorize([Roles.Admin]), getUsers);
router.put("/:id", updateUserDetails);
router.put("/:id/password", updatePassword)

export default router;