import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './RegisterComp.css';

const RegisterComp = () => {
  const [name, setName] = useState("");
  const [facultyID, setFacultyID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/users", {
        username: name,
        facultyID: facultyID,
        email: email,
        password: password,
      });

      setLoading(false);
      setSuccess(true);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">
            <strong>Name:</strong>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Name"
            autoComplete="off"
            value={name}
            name="name"
            id="name"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="invalid-feedback">Please fill out this field.</div>
        </div>

        <div className="form-group">
          <label htmlFor="facultyID">
            <strong>FacultyID:</strong>
          </label>
          <input
            type="text"
            className="form-control"
            id="facultyID"
            placeholder="Enter FacultyID"
            name="facultyID"
            autoComplete="off"
            value={facultyID}
            onChange={(e) => setFacultyID(e.target.value)}
            required
          />
          <div className="invalid-feedback">Please fill out this field.</div>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <strong>Email:</strong>
          </label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email"
            autoComplete="off"
            value={email}
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
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
        {success && (
          <div className="success-message" role="alert">
            Registration successful! Please login to continue.
          </div>
        )}

        <div className="form-group">
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterComp;
