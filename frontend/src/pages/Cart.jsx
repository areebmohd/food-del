import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import "./Cart.css";

const Cart = () => {
  const {
    cartItems,
    remove,
    clear,
    formatCurrency,
    subtotal,
    deliveryFee,
    grandTotal,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const onApplyPromo = (e) => {
    e.preventDefault();
  };

  const navigate = useNavigate();

  return (
    <div className="cart">
      <div className="top">
        <p>Item</p>
        <p>Name</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Cut</p>
      </div>
      <div className="bottom">
        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          cartItems.map(({ id, item, qty, unit, total }) => (
            <div key={id} className="cart-row">
              <div className="cart-col item">
                <img
                  src={item.img}
                  alt={item.itemname}
                  className="cart-item-img"
                />
              </div>
              <div className="cart-col name">{item.itemname}</div>
              <div className="cart-col price">{formatCurrency(unit)}</div>
              <div className="cart-col quantity">{qty}</div>
              <div className="cart-col total">{formatCurrency(total)}</div>
              <div className="cart-col actions">
                <button className="cut-btn" onClick={() => remove(id)}>
                  -
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="cart-footer">
          <button className="clear-btn" onClick={clear}>
            Clear Cart
          </button>
        </div>
      )}
      <div className="summary-section">
        <div className="promo-box">
          <p className="box-title">Apply Promo Code</p>
          <form className="promo-form" onSubmit={onApplyPromo}>
            <input
              className="promo-input"
              type="text"
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button className="promo-btn" type="submit">
              Apply
            </button>
          </form>
        </div>
        <div className="total-box">
          <p className="box-title">Order Summary</p>
          <div className="total-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="total-row">
            <span>Delivery Fee</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="total-row grand">
            <span>Total Payment</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
          <button
            className="checkout-btn"
            disabled={cartItems.length === 0}
            onClick={() => navigate("/placeorder")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
