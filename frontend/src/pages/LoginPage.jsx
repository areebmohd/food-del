import React, { useState } from "react";
import "./LoginPage.css";
import { useAuth } from "../components/AuthContext";

const LoginPage = ({ setShowLoginPage }) => {
  const [curState, setCurState] = useState("login");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      let result;
      if (curState === "login") {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.email, formData.password);
      }

      if (result.success) {
        setShowLoginPage(false);
        setFormData({ email: "", password: "" });
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginBox">
        {curState === "login" ? (
          <div className="main">
            <div className="title">
              <p>Login</p>
              <p onClick={() => setShowLoginPage(false)} className="close">
                ⨉
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="inputs">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="checkBox">
                  <input type="checkbox" required />
                  <p>I agree to all terms and conditions.</p>
                </div>
              </div>
              {error && <div className="error">{error}</div>}
              <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>
            </form>
            <div className="switch">
              <p>Create account.</p>
              <span onClick={() => setCurState("signup")}>Click here</span>
            </div>
          </div>
        ) : (
          <div className="main">
            <div className="title">
              <p>Sign up</p>
              <p onClick={() => setShowLoginPage(false)} className="close">
                ⨉
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="inputs">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password (min 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="checkBox">
                  <input type="checkbox" required />
                  <p>I agree to all terms and conditions.</p>
                </div>
              </div>
              {error && <div className="error">{error}</div>}
              <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Sign up"}
              </button>
            </form>
            <div className="switch">
              <p>Already have a account?</p>
              <span onClick={() => setCurState("login")}>Login</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
