// src/pages/ToursPage.jsx
import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { tours } from "../data/tours.js";
import TourCard from "../components/TourCard.jsx";

const ToursPage = () => {
  return (
    <>
      <Navbar />
      <main className="bg-[#f3f4f6] min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#f4b41a]">
              Turlar
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Osmanlı Başkentleri Turları
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              Fuar dönemi için özel olarak hazırlanan, Dr. Ahmet Anapalı
              rehberliğindeki Osmanlı Başkentleri turlarını aşağıdan
              inceleyebilirsiniz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ToursPage;
