import foodModel from "../models/foodModel.js";
import fs from "fs";

const addFood = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }

    // Get all fields from request body
    const { name, price, category } = req.body;
    const description = req.body.description || "No description provided";

    // Check if all required fields are present
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required",
        received: { name, price, category, description },
      });
    }

    // Validate price is a number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Price must be a valid positive number",
        });
    }

    // Create food object
    const food = new foodModel({
      name: name.toString().trim(),
      description: description.toString().trim(),
      price: priceNum,
      category: category.toString().trim(),
      image: req.file.filename,
    });

    // Save to database
    await food.save();
    res.json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.log("Error in addFood:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "food removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

export { addFood, listFood, removeFood };
