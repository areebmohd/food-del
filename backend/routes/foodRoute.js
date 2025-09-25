import express from "express";
import {
  addFood,
  listFood,
  removeFood,
} from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    fieldSize: 1024 * 1024, // 1MB limit for text fields
  },
  fileFilter: (req, file, cb) => {
    // Accept any file type for now
    cb(null, true);
  },
});

// Test endpoint to check form data
foodRouter.post("/test", (req, res) => {
  console.log("=== TEST ENDPOINT ===");
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);
  res.json({
    success: true,
    body: req.body,
    headers: req.headers,
  });
});

// Test endpoint without file upload
foodRouter.post("/add-test", (req, res) => {
  console.log("=== ADD TEST (NO FILE) ===");
  console.log("Request body:", req.body);

  const { name, description, price, category } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
      received: { name, description, price, category },
    });
  }

  res.json({
    success: true,
    message: "Test successful",
    data: { name, description, price, category },
  });
});

// Test endpoint with multer but no file required
foodRouter.post("/add-test-multer", upload.none(), (req, res) => {
  console.log("=== ADD TEST WITH MULTER (NO FILE) ===");
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);

  const { name, description, price, category } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
      received: { name, description, price, category },
    });
  }

  res.json({
    success: true,
    message: "Multer test successful",
    data: { name, description, price, category },
  });
});

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.post("/remove", removeFood);
foodRouter.get("/list", listFood);

export default foodRouter;
