import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  placeOrder,
  verifyPayment,
  listUserOrders,
  listAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Place order and create Razorpay order
orderRouter.post("/place", authenticateToken, placeOrder);

// Verify Razorpay payment signature and mark paid
orderRouter.post("/verify", authenticateToken, verifyPayment);

// User's orders
orderRouter.get("/my", authenticateToken, listUserOrders);

// Admin routes (no admin auth middleware in project yet; exposed for now)
orderRouter.get("/all", listAllOrders);
orderRouter.put("/status/:id", updateOrderStatus);

export default orderRouter;
