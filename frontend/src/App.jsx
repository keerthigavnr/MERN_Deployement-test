import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthPage from "./AuthPage";

const App = () => {
 // useTokenExpirationHandler();

  const isLoggedIn = window.localStorage.getItem("isLoggedIn");
  const role = window.localStorage.getItem("role");

  return (
    <Routes>
      {/* <Route path="/" element={isLoggedIn ? (role === "Admin" ? <Navigate to="/admin" /> : <Navigate to="/user" />) : <AuthPage />} /> */}
      <Route path="/" element={<AuthPage />} />
      
    </Routes>
  );
};

export default App;
