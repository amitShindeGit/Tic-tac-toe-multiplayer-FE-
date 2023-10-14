import React from "react";
import {  Routes, Route, HashRouter } from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Home from "../Pages/Home";
import Room from "../Pages/Room";
import IndexPage from "../Pages/IndexPage";

const TicTacRoutes = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} exact />
        <Route path="/login" element={<Login />} exact />
        <Route path="/register" element={<Register />} exact />
        <Route path="/dashboard" element={<Home />} exact />
        <Route path="/room/:id" element={<Room />} exact />
        <Route
          path="*"
          element={<p style={{ fontSize: "2rem" }}>Page not found</p>}
        />
      </Routes>
    </HashRouter>
  );
};

export default TicTacRoutes;
