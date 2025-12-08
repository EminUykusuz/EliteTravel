// src/components/TourCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TourCard = ({ tour }) => {
  const currencySymbol = tour.currency === "EUR" ? "€" : "₺";

  return (
    <motion.article
      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(15,23,42,0.06)] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0 18px 30px rgba(15,23,42,0.12)" }}
    >
      <div className="aspect-[4/3] relative">
        <img
          src={tour.thumbnail}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 text-[11px] rounded-full bg-[#0b3954] text-white font-semibold shadow">
            {tour.type}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <h3 className="font-semibold text-slate-900 text-sm md:text-base">
          {tour.title}
        </h3>

        <p className="text-xs text-slate-600 max-h-16 overflow-hidden leading-relaxed">
          {tour.summary}
        </p>

        <div className="flex justify-between items-center text-[11px] text-slate-600">
          <span>{tour.datesText}</span>
          <span>
            Kişi Başı{" "}
            <span className="font-bold text-[#f4b41a]">
              {currencySymbol}
              {tour.price.toLocaleString("tr-TR")}
            </span>
          </span>
        </div>

        <Link
          to={`/tur/${tour.slug}`}
          className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#f4b41a] text-white text-xs font-semibold uppercase tracking-wide hover:bg-[#ffd65b] transition"
        >
          Detayları Gör
        </Link>
      </div>
    </motion.article>
  );
};

export default TourCard;
