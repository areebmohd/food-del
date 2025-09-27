import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import { CartProvider } from "./components/CartContext";
import { AuthProvider } from "./components/AuthContext";
import { useState } from "react";
import Orders from "./pages/Orders";

function App() {
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [value, setValue] = useState("Home");

  return (
    <>
      <AuthProvider>
        {showLoginPage ? (
          <LoginPage setShowLoginPage={setShowLoginPage} />
        ) : (
          <></>
        )}
        <div className="page">
          <div className="app">
            <CartProvider>
              <Navbar setShowLoginPage={setShowLoginPage} value={value} setValue={setValue}/>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/placeorder" element={<PlaceOrder setValue={setValue}/>} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </CartProvider>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
