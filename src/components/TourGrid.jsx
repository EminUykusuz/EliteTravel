// src/components/TourGrid.jsx
import React from "react";
import { tours } from "../data/tours.js";
import TourCard from "./TourCard.jsx";

const TourGrid = () => {
  return (
    <section id="turlar" className="bg-[#020814] border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#f4b41a]">
            Tur Programları
          </p>
          <h2 className="text-2xl md:text-3xl font-bold">
            2025 Osmanlı Başkentleri Turları
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Fiyatlar fuar dönemi için geçerli olup sınırlı kontenjanlıdır.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TourGrid;
