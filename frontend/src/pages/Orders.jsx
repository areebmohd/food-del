import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import "./Orders.css";
import { url } from "../assets/assets";

const statusBadge = (status) => {
  const map = {
    "Food Processing": { bg: "#fef9c3", color: "#92400e" },
    Confirmed: { bg: "#dcfce7", color: "#14532d" },
    "Out for Delivery": { bg: "#dbeafe", color: "#1e3a8a" },
    Delivered: { bg: "#e9d5ff", color: "#5b21b6" },
    Cancelled: { bg: "#fee2e2", color: "#991b1b" },
  };
  const s = map[status] || { bg: "#f3f4f6", color: "#111827" };
  return { backgroundColor: s.bg, color: s.color };
};

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`${url}/api/order/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        if (data.success) setOrders(data.data);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {loading && <p>Loading...</p>}
      {!loading && orders.length === 0 && <p>No orders yet.</p>}
      <div className="orders-list">
        {orders.map((o) => (
          <div key={o._id} className="order-card">
            <div className="order-top">
              <div>
                <div className="order-id">Order #{o._id.slice(-6)}</div>
                <div className="order-date">
                  {new Date(o.date).toLocaleString()}
                </div>
              </div>
              <div className="order-status" style={statusBadge(o.status)}>
                {o.status}
              </div>
            </div>
            <div className="order-items">
              {o.items.map((it, idx) => (
                <div key={idx} className="order-item">
                  <span>{it.name}</span>
                  <span>x{it.quantity}</span>
                  <span>₹{it.price}</span>
                </div>
              ))}
            </div>
            <div className="order-bottom">
              <div className="addr">
                <div className="label">Deliver to</div>
                <div className="text">
                  {o.address?.name}, {o.address?.address}, {o.address?.city},{" "}
                  {o.address?.state} {o.address?.pincode}, {o.address?.country}
                </div>
              </div>
              <div className="pay">
                <div className="amount">Total: ₹{o.amount}</div>
                <div
                  className={"pay-status " + (o.payment ? "paid" : "unpaid")}
                >
                  {o.payment ? "Paid" : "Unpaid"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
