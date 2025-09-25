import cartModel from "../models/cartModel.js";
import foodModel from "../models/foodModel.js";

// Get user's cart
export const getUserCart = async (req, res) => {
  try {
    const cart = await cartModel
      .findOne({ userId: req.userId })
      .populate("items.foodId");

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [] },
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { foodId, quantity = 1 } = req.body;

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required",
      });
    }

    // Check if food exists
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    // Find or create cart
    let cart = await cartModel.findOne({ userId: req.userId });

    if (!cart) {
      cart = new cartModel({
        userId: req.userId,
        items: [],
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.foodId.toString() === foodId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ foodId, quantity });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    if (!foodId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Food ID and quantity are required",
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }

    let cart = await cartModel.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.foodId.toString() === foodId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (quantity === 0) {
      // Remove item from cart
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cart,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Clear user's cart
export const clearCart = async (req, res) => {
  try {
    await cartModel.findOneAndDelete({ userId: req.userId });

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
