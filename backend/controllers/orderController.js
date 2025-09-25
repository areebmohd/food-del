import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance using environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Helper to ensure Razorpay keys are present
const ensureRazorpayConfigured = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      "Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env"
    );
  }
};

// POST /api/order/place
// Create an order and a corresponding Razorpay order
const placeOrder = async (req, res) => {
  try {
    ensureRazorpayConfigured();

    const userId = req.userId || req.body.userId; // prefer token user
    const { items, amount, address } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No items to order" });
    }

    if (!amount || isNaN(Number(amount))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }

    // Create DB order (payment pending)
    const newOrder = new orderModel({
      userId,
      items,
      amount: Number(amount),
      address,
      payment: false,
      status: "Food Processing",
      paymentMethod: "razorpay",
    });

    await newOrder.save();

    // Create Razorpay order (amount in paise)
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: String(newOrder._id),
      notes: {
        userId: String(userId || ""),
      },
    };

    const rpOrder = await razorpay.orders.create(options);

    // Persist Razorpay order id on our order
    newOrder.razorpayOrderId = rpOrder.id;
    await newOrder.save();

    return res.status(200).json({
      success: true,
      message: "Order placed. Proceed to payment.",
      data: {
        orderId: newOrder._id,
        razorpayOrderId: rpOrder.id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error("placeOrder error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Error" });
  }
};

// POST /api/order/verify
// Verify payment signature, mark order paid, clear cart
const verifyPayment = async (req, res) => {
  try {
    ensureRazorpayConfigured();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing payment verification fields",
        });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    // Mark the order as paid
    const order = await orderModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        payment: true,
        status: "Confirmed",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Clear the user's cart (if authenticated)
    const userId = req.userId || order.userId;
    if (userId) {
      await cartModel.findOneAndDelete({ userId });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Payment verified",
        data: { orderId: order._id },
      });
  } catch (error) {
    console.error("verifyPayment error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Error" });
  }
};

// GET /api/order/my - list user's orders
const listUserOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.userId })
      .sort({ date: -1 });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("listUserOrders error:", error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

// GET /api/order/all - admin list all orders
const listAllOrders = async (_req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("listAllOrders error:", error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

// PUT /api/order/status/:id - admin update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const order = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

export {
  placeOrder,
  verifyPayment,
  listUserOrders,
  listAllOrders,
  updateOrderStatus,
};
