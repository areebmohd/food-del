import React, { useEffect, useState } from "react";
import "./Orders.css";
import { url } from "../assets/assets";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${url}/api/order/all`);
      const data = await resp.json();
      if (data.success) setOrders(data.data);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const resp = await fetch(`${url}/api/order/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await resp.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o._id === id ? data.data : o)));
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="admin-orders-page">
      <h2>All Orders</h2>
      {loading && <p>Loading...</p>}
      <div className="orders-table">
        <div className="orders-thead">
          <div>ID</div>
          <div>User</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Payment</div>
          <div>Actions</div>
        </div>
        <div className="orders-tbody">
          {orders.map((o) => (
            <div className="orders-row" key={o._id}>
              <div>#{o._id.slice(-6)}</div>
              <div>{o.userId}</div>
              <div>₹{o.amount}</div>
              <div>{o.status}</div>
              <div>{o.payment ? "Paid" : "Unpaid"}</div>
              <div>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                >
                  {[
                    "Food Processing",
                    "Confirmed",
                    "Out for Delivery",
                    "Delivered",
                    "Cancelled",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
