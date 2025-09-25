import React, { useEffect, useState } from "react";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:4000/api/user/users");
      const data = await resp.json();
      if (data.success) {
        setUsers(data.data);
        console.log(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-users-page">
      <h2>All Users</h2>
      {loading && <p>Loading...</p>}
      <div className="table">
        <div className="titles">
          <div className="title">ID</div>
          <div className="title">Email</div>
        </div>
        {users.map((user, index) => (
          <div className="values" key={index}>
            <div className="value">{user._id}</div>
            <div className="value">{user.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
