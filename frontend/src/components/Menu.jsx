import React, { useState, useEffect } from "react";
import "./Menu.css";
import { useCart } from "./CartContext";

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { add, remove, quantities } = useCart();

  const headings = ["Main Menu", "Biryanis", "Salads", "Drinks"];

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/food/list");
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setFoods(data.data);
          console.log(data.data);
        } else if (Array.isArray(data)) {
          setFoods(data);
          console.log(data.data);
        } else if (data.foods) {
          setFoods(data.foods);
          console.log(data.data);
        }
      } catch (error) {
        console.error("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  if (loading) {
    return (
      <div className="menu" id="menu">
        <div className="loading">Loading food items...</div>
      </div>
    );
  }

  return (
    <div className="menu" id="menu">
      {headings.map((heading, index) => {
        return (
          <div key={index} className="categories">
            <p className="heading">{heading}</p>
            <div className="mainMenu">
              {foods.map((item, index) => {
                if (item.category === heading) {
                  return (
                    <div
                      className={
                        heading === "Drinks" ? "drinks foodBox" : "foodBox"
                      }
                      key={item._id ?? index}
                    >
                      <img
                        src={`http://localhost:4000/images/${item.image}`}
                        alt={item.name}
                      />
                      <div className="content">
                        <div
                          className={
                            heading === "Drinks" ? "drinksTitle title" : "title"
                          }
                        >
                          <div className="titleLeft">
                            <p className="name">{item.name}</p>
                            <p className="price">₹{item.price}</p>
                          </div>
                          <div className="titleRight">
                            {quantities[item._id] ? (
                              <div className="icons">
                                <div
                                  className="minus icon"
                                  onClick={() => remove(item._id)}
                                >
                                  -
                                </div>
                                <div className="quantity">
                                  {quantities[item._id]}
                                </div>
                                <div
                                  className="plus icon"
                                  onClick={() => add(item._id)}
                                >
                                  +
                                </div>
                              </div>
                            ) : (
                              <button
                                className="cartButton"
                                onClick={() => add(item._id)}
                              >
                                Add To Cart
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="description">{item.description}</p>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
