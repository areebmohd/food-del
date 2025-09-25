import React, { useState, useEffect } from "react";
import "./List.css";
import { url } from "../assets/assets";

const List = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch food items from backend
  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/api/food/list`);
      const result = await response.json();

      if (result.success) {
        setFoods(result.data);
      } else {
        setMessage({ type: "error", text: "Failed to fetch food items" });
      }
    } catch (error) {
      console.error("Error fetching foods:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Delete food item
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        const response = await fetch(`${url}/api/food/remove`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();

        if (result.success) {
          setMessage({
            type: "success",
            text: "Food item deleted successfully!",
          });
          // Remove the item from the local state
          setFoods(foods.filter((food) => food._id !== id));
        } else {
          setMessage({
            type: "error",
            text: result.message || "Failed to delete food item",
          });
        }
      } catch (error) {
        console.error("Error deleting food:", error);
        setMessage({ type: "error", text: "Network error. Please try again." });
      }
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <div className="list">
      <div className="list-container">
        <h2>Food Items List</h2>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {loading ? (
          <div className="loading">Loading food items...</div>
        ) : foods.length === 0 ? (
          <div className="no-items">No food items found.</div>
        ) : (
          <div className="food-list">
            <div className="list-header">
              <p>Image</p>
              <p>Name</p>
              <p>Category</p>
              <p>Price</p>
              <p>Description</p>
              <p>Action</p>
            </div>
            <div className="list-items">
              {foods.map((food) => (
                <div key={food._id} className="food-item">
                  <div className="food-col image">
                    <img
                      src={`${url}/images/${food.image}`}
                      alt={food.name}
                      className="food-img"
                    />
                  </div>
                  <div className="food-col name">{food.name}</div>
                  <div className="food-col category">{food.category}</div>
                  <div className="food-col price">
                    {formatCurrency(food.price)}
                  </div>
                  <div className="food-col description">{food.description}</div>
                  <div className="food-col action">
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(food._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
