// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/elite-travel-logo.png"
            alt="Elite travel logo"
            className="h-10 md:h-11 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-700 uppercase">
          <a href="#turlar" className="hover:text-[#0b3954] transition">
            Turlar
          </a>
          <a href="#takvim" className="hover:text-[#0b3954] transition">
            Tur Takvimi
          </a>
          <a href="#neden" className="hover:text-[#0b3954] transition">
            Neden Biz?
          </a>
          <a href="#sss" className="hover:text-[#0b3954] transition">
            SSS
          </a>
          <a href="#iletisim" className="hover:text-[#0b3954] transition">
            İletişim
          </a>
        </nav>

        <a
          href="#iletisim"
          className="hidden md:inline-flex items-center px-4 py-2 rounded-full bg-[#f4b41a] text-white text-xs font-semibold uppercase tracking-wide hover:bg-[#f7c94c] transition"
        >
          Hemen Bilgi Al
        </a>
      </div>
    </header>
  );
};

export default Navbar;
