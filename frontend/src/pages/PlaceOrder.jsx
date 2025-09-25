import React, { useEffect, useState, useCallback } from "react";
import { useCart } from "../components/CartContext";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PlaceOrder = () => {
  const {
    cartItems,
    subtotal,
    deliveryFee,
    grandTotal,
    formatCurrency,
    clear,
  } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toOrderItems = useCallback(() => {
    return cartItems.map((ci) => ({
      foodId: ci.id,
      name: ci.item.itemname,
      quantity: ci.qty,
      price: ci.unit,
    }));
  }, [cartItems]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!token || !user) {
      alert("Please login to make a payment");
      return;
    }

    if (cartItems.length === 0) return;

    setSubmitting(true);
    try {
      // 1) Create order on backend and get Razorpay order id
      const resp = await fetch("http://localhost:4000/api/order/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: toOrderItems(),
          amount: grandTotal,
          address: form,
        }),
      });

      const data = await resp.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to place order");
      }

      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Failed to load Razorpay");

      const { key, razorpayOrderId, amount, currency } = data.data;

      const rzpOptions = {
        key,
        amount: amount,
        currency: currency || "INR",
        name: "Food Delivery",
        description: "Order Payment",
        order_id: razorpayOrderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          address: `${form.address}, ${form.city}, ${form.state} ${form.pincode}, ${form.country}`,
        },
        theme: { color: "#10b981" },
        handler: async function (response) {
          try {
            const verifyResp = await fetch(
              "http://localhost:4000/api/order/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );
            const verifyData = await verifyResp.json();
            if (!verifyData.success)
              throw new Error(
                verifyData.message || "Payment verification failed"
              );
            await clear();
            navigate("/orders", { replace: true });
          } catch (err) {
            alert(err.message || "Verification error");
          }
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on("payment.failed", function (resp) {
        alert(resp.error?.description || "Payment failed");
        setSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      alert(err.message || "Payment initialization failed");
      setSubmitting(false);
    }
  };

  // Autofill helpers
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const timer = setTimeout(async () => {
      const pin = (form.pincode || "").trim();
      if (pin.length !== 6) return;
      try {
        const res = await fetch(
          `https://api.zippopotam.us/IN/${encodeURIComponent(pin)}`,
          { signal }
        );
        if (!res.ok) throw new Error("PIN lookup failed");
        const data = await res.json();
        const place = Array.isArray(data.places) && data.places[0];
        if (place) {
          setForm((prev) => ({
            ...prev,
            city: place["place name"] || prev.city,
            state: place.state || prev.state,
            country: data.country || prev.country,
          }));
        }
      } catch (_e) {
        // ignore
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [form.pincode]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const timer = setTimeout(async () => {
      const city = (form.city || "").trim();
      if (city.length < 3) return;
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&city=${encodeURIComponent(
          city
        )}&country=India`;
        const res = await fetch(url, {
          signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("City lookup failed");
        const data = await res.json();
        const entry = Array.isArray(data) && data[0];
        const addr = entry?.address;
        if (addr) {
          setForm((prev) => ({
            ...prev,
            state: addr.state || prev.state,
            country: addr.country || prev.country,
          }));
        }
      } catch (_e) {
        // ignore
      }
    }, 600);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [form.city]);

  return (
    <div className="placeorder-container">
      <div className="order-grid">
        <div className="user-form-box">
          <p className="box-title">Delivery Details</p>
          <form className="form-grid" onSubmit={onSubmit}>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Name"
              required
            />
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email"
              type="email"
              required
            />
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="Phone"
              required
            />
            <input
              name="address"
              value={form.address}
              onChange={onChange}
              placeholder="Address"
              required
              className="full"
            />
            <input
              name="pincode"
              value={form.pincode}
              onChange={onChange}
              placeholder="Pin Code"
            />
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="City"
            />
            <input
              name="state"
              value={form.state}
              onChange={onChange}
              placeholder="State"
            />
            <input
              name="country"
              value={form.country}
              onChange={onChange}
              placeholder="Country"
            />
          </form>
        </div>
        <div className="pay-box">
          <p className="box-title">Payment Summary</p>
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
            className="pay-btn"
            disabled={cartItems.length === 0 || submitting}
            onClick={onSubmit}
          >
            {submitting ? "Processing..." : "Make Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
