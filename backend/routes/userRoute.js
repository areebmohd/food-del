import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  listUsers,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", listUsers);

// Protected routes
router.get("/profile", authenticateToken, getUserProfile);

export default router;
