import React from "react";
import "./Navbar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setShowLoginPage }) => {
  const [value, setValue] = useState("Home");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar">
      <h2 className="navLeft">Fooddel</h2>
      <ul className="navMid">
        <Link
          to="/"
          onClick={() => setValue("Home")}
          className={value === "Home" ? "active" : "link"}
        >
          Home
        </Link>
        <a
          href="#menu"
          onClick={() => {
            setValue("Menu");
            navigate("/");
          }}
          className={value === "Menu" ? "active" : "link"}
        >
          Menu
        </a>
        <Link
          to="/cart"
          onClick={() => setValue("Cart")}
          className={value === "Cart" ? "active" : "link"}
        >
          Cart
        </Link>
        {user && (
          <Link
            to="/orders"
            onClick={() => setValue("Orders")}
            className={value === "Orders" ? "active" : "link"}
          >
            Orders
          </Link>
        )}
        <a
          href="#footer"
          onClick={() => setValue("About")}
          className={value === "About" ? "active" : "link"}
        >
          About
        </a>
        <a
          href="#footer"
          onClick={() => setValue("Contact")}
          className={value === "Contact" ? "active" : "link"}
        >
          Contact
        </a>
      </ul>
      {user ? (
        <div className="navRight">
          <span className="user-email">{user.email}</span>
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="navRight">
          <button className="btn" onClick={() => setShowLoginPage(true)}>
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
