import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Orders from "./pages/Orders";
import List from "./pages/List";
import Add from "./pages/Add";
import { Routes, Route } from "react-router-dom";
import Users from "./pages/Users";

const App = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <div className="app">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
