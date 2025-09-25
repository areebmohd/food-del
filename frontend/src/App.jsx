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
              <Navbar setShowLoginPage={setShowLoginPage} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/placeorder" element={<PlaceOrder />} />
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
