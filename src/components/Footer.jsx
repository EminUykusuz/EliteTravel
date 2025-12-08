// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 text-[11px] md:text-xs flex flex-col md:flex-row items-center justify-between gap-3 text-slate-500">
        <div className="flex items-center gap-2">
          <img
            src="/images/elite-travel-logo.png"
            alt="Elite Travel"
            className="h-7 w-auto"
          />
          <span>© {new Date().getFullYear()} Elite Travel. Tüm hakları saklıdır.</span>
        </div>
        <div className="flex gap-4">
          <span>Fuara Özel Osmanlı Başkentleri Turları</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
