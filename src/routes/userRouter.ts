import express from "express";
import { getUser, updatePassword, updateUserDetails,getUsers, updateUserRole } from "../controllers/userController";
import { authorize } from "../middleware/authMiddleware";
import { Roles } from "../constants";

const router = express.Router();

router.get("/:id", authorize([Roles.User, Roles.Admin]), getUser);
router.get("/", authorize([Roles.Admin]), getUsers);
router.put("/:id", updateUserDetails);
router.put("/:id/password", updatePassword)
router.put("/:id/role", authorize([Roles.Admin]), updateUserRole);

export default router;