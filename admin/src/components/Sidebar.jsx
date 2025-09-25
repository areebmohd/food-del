import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sideBar">
      <NavLink to="/add" className="link">
        Add Item
      </NavLink>
      <NavLink to="/list" className="link">
        List Items
      </NavLink>
      <NavLink to="/orders" className="link">
        Orders
      </NavLink>
      <NavLink to="/users" className="link">
        Users
      </NavLink>
    </div>
  );
};

export default Sidebar;
