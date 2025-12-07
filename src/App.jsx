import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import TourDetailPage from "./pages/TourDetailPage.jsx";

const App = () => {
  return (
   <div className="bg-slate-50 text-slate-900 min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tur/:slug" element={<TourDetailPage />} />
      </Routes>
    </div>
  );
};

export default App;
