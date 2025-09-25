import express from "express";
import {
  getUserCart,
  addToCart,
  updateCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Cart routes
router.get("/", getUserCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/clear", clearCart);

export default router;
