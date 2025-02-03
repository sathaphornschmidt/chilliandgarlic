import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ReservationDetailPage from "./pages/ReservationDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservations/:id" element={<ReservationDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
