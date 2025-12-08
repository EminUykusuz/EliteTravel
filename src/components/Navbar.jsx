// src/components/Navbar.jsx
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Phone } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/elite-travel-logo.png"
            alt="Elite Travel"
            className="h-9 w-auto"
          />
        </Link>

        {/* Menü */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-[#0b3954] ${
                isActive ? "text-[#0b3954] font-semibold" : "text-slate-600"
              }`
            }
          >
            Ana Sayfa
          </NavLink>
          <NavLink
            to="/turlar"
            className={({ isActive }) =>
              `hover:text-[#0b3954] ${
                isActive ? "text-[#0b3954] font-semibold" : "text-slate-600"
              }`
            }
          >
            Turlar
          </NavLink>
          <NavLink
            to="/hakkimizda"
            className={({ isActive }) =>
              `hover:text-[#0b3954] ${
                isActive ? "text-[#0b3954] font-semibold" : "text-slate-600"
              }`
            }
          >
            Hakkımızda
          </NavLink>
          <NavLink
            to="/iletisim"
            className={({ isActive }) =>
              `hover:text-[#0b3954] ${
                isActive ? "text-[#0b3954] font-semibold" : "text-slate-600"
              }`
            }
          >
            İletişim
          </NavLink>
        </div>

        {/* Sağ taraf – Telefon CTA */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Phone className="w-4 h-4 text-[#0b3954]" />
            <span>+31 6 21525757</span>
          </div>
        </div>

        {/* Mobile placeholder (istersen ileride menu ekleriz) */}
        <div className="md:hidden text-xs text-slate-600">Menu</div>
      </div>
    </nav>
  );
};

export default Navbar;
