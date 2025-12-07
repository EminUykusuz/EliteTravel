// src/components/TourCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const TourCard = ({ tour }) => {
  return (
    <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
      <div className="aspect-[4/3] relative">
        <img
          src={tour.thumbnail}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020814]/90 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 text-[11px] rounded-full bg-[#0b3954] text-slate-50 font-semibold">
            {tour.type}
          </span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-3">
        <h3 className="font-semibold text-sm md:text-base">{tour.title}</h3>
        <p className="text-xs text-slate-400 max-h-16 overflow-hidden">
          {tour.summary}
        </p>
        <div className="flex justify-between items-center text-[11px] text-slate-300">
          <span>{tour.datesText}</span>
          <span>
            Kişi Başı{" "}
            <span className="font-bold text-[#f4b41a]">
              ₺{tour.price.toLocaleString("tr-TR")}
            </span>
          </span>
        </div>
        <Link
          to={`/tur/${tour.slug}`}
          className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#f4b41a] text-[#020814] text-xs font-semibold uppercase tracking-wide hover:bg-[#ffd44f] transition"
        >
          Detayları Gör
        </Link>
      </div>
    </article>
  );
};

export default TourCard;
