// src/components/TourGrid.jsx
import React from "react";
import { tours } from "../data/tours.js";
import TourCard from "./TourCard.jsx";
import { motion } from "framer-motion";

const TourGrid = () => {
  return (
    <section className="bg-[#f3f4f6] border-t border-slate-200">
      <motion.div
        className="max-w-6xl mx-auto px-4 py-12 md:py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#f4b41a]">
            Tur Programları
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Osmanlı Başkentleri Turları
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Fuar dönemi için özel hazırlanmış, sınırlı kontenjanlı programlar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TourGrid;
