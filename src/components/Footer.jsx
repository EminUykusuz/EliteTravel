// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#020814] border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} Elite travel. Tüm hakları saklıdır.
        </div>
        <div>TURSAB No / Şirket Ünvanı buraya gelecek.</div>
      </div>
    </footer>
  );
};

export default Footer;
