import React, { useState } from "react";
import LoginComp from "./LoginComp";
import RegisterComp from "./RegisterComp";
import "./AuthPage.css"; // Import the CSS file

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="auth-container">
      <h1 className="title">Examiner Management Portal</h1>

      <div className="auth-card">
        <ul className="nav-tabs">
          <li
            className={`nav-item ${activeTab === "login" ? "active" : ""}`}
            onClick={() => handleTabClick("login")}
          >
            <a className="nav-link" href="#login">Login</a>
          </li>
          <li
            className={`nav-item ${activeTab === "register" ? "active" : ""}`}
            onClick={() => handleTabClick("register")}
          >
            <a className="nav-link" href="#register">Register</a>
          </li>
        </ul>

        <div className="tab-content">
          {activeTab === "login" && (
            <div id="login" className="tab-pane active">
              <LoginComp />
            </div>
          )}
          {activeTab === "register" && (
            <div id="register" className="tab-pane active">
              <RegisterComp />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
