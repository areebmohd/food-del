import React, { useState } from "react";
import "./Add.css";
import { url } from "../assets/assets";

const Add = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const categories = ["Main Menu", "Biryanis", "Salads", "Drinks"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Please select a valid image file" });
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image size should be less than 5MB",
        });
        return;
      }
      setImage(file);
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "Food name is required" });
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setMessage({ type: "error", text: "Please enter a valid price" });
      return;
    }
    if (!formData.category) {
      setMessage({ type: "error", text: "Please select a category" });
      return;
    }
    if (!image) {
      setMessage({ type: "error", text: "Please select an image" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("image", image);

      const response = await fetch(`${url}/api/food/add`, {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "Food item added successfully!" });
        // Reset form
        setFormData({
          name: "",
          price: "",
          category: "",
          description: "",
        });
        setImage(null);
        document.getElementById("imageInput").value = "";
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to add food item",
        });
      }
    } catch (error) {
      console.error("Error adding food:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add">
      <div className="add-container">
        <h2>Add New Food Item</h2>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-group">
            <label htmlFor="name">Food Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter food name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter food description (optional)"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Food Image *</label>
            <input
              type="file"
              id="imageInput"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            {image && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    marginTop: "10px",
                  }}
                />
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Food Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
