import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './LoginComp.css'; // Import the CSS file

const LoginComp = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.localStorage.setItem("isLoggedIn", true);
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post("https://mern-deployment-api.vercel.app/users/login", {
        identifier: identifier,
        password: password,
      });

      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("role", data.role); // Store the role
        const role = data.role;
        navigate(role === "Admin" ? "/admin" : "/user");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="identifier">
            <strong>Email or FacultyID:</strong>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Email or Faculty ID"
            autoComplete="off"
            value={identifier}
            name="identifier"
            id="identifier"
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <div className="invalid-feedback">Please fill out this field.</div>
        </div>
        <div className="form-group">
          <label htmlFor="password">
            <strong>Password:</strong>
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            name="password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="invalid-feedback">Please fill out this field.</div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
      <br />
      <Link to="/forgot-password" className="forgot-password">Forgot password</Link>
    </div>
  );
};

export default LoginComp;
