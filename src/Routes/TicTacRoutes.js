import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Home from "../Pages/Home";
import Room from "../Pages/Room";
import IndexPage from "../Pages/IndexPage";

const TicTacRoutes = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} exact />
        <Route path="/login" element={<Login />} exact />
        <Route path="/register" element={<Register />} exact />
        <Route path="/dashboard" element={<Home />} exact />
        <Route path="/room/:id" element={<Room />} exact />
        <Route path="*" element={<p>Not found page</p>} />
      </Routes>
    </BrowserRouter>
  );
};

export default TicTacRoutes;
