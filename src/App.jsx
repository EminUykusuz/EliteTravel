// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ToursPage from "./pages/ToursPage.jsx";
import TourDetailPage from "./pages/TourDetailPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/turlar" element={<ToursPage />} />
        <Route path="/tur/:slug" element={<TourDetailPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/hakkimizda" element={<AboutPage />} />
      </Routes>
    </div>
  );
};

export default App;
