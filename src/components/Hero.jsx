// src/components/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-[#041326] via-[#020814] to-[#020814]">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        {/* Sol */}
        <div className="space-y-5">
          <p className="text-[#f4b41a] text-xs font-semibold uppercase tracking-[0.25em]">
            Fuara Özel Kültür Turları
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-[#e5edf4]">
            Osmanlı Başkentlerini{" "}
            <span className="text-[#f4b41a]">Elite travel ile keşfedin</span>
          </h1>
          <p className="text-slate-200 text-sm md:text-base max-w-xl">
            İstanbul, Bursa, Bilecik ve Söğüt’ü kapsayan günübirlik ve
            konaklamalı turlar. Kurumsal güvence, profesyonel rehberlik ve
            fuara özel fiyatlarla.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#turlar"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#f4b41a] text-[#020814] text-sm font-semibold hover:bg-[#ffd44f] transition"
            >
              Turları Gör
            </a>
            <a
              href="#iletisim"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-[#0b3954] text-sm font-semibold text-slate-100 hover:border-[#f4b41a] hover:text-[#f4b41a] transition"
            >
              WhatsApp’tan Sor
            </a>
          </div>

          <div className="flex flex-wrap gap-6 text-[11px] text-slate-300">
            <div>
              <div className="font-semibold text-[#e5edf4]">Fuara Özel</div>
              <div>2025 çıkışlı sabit fiyat garantisi</div>
            </div>
            <div>
              <div className="font-semibold text-[#e5edf4]">0–6 yaş ücretsiz*</div>
              <div>*Seçili turlarda</div>
            </div>
          </div>
        </div>

        {/* Sağ */}
        <div className="relative">
          <div className="bg-[#020814]/80 border border-slate-700 rounded-3xl p-3 md:p-4 shadow-xl">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
              <img
                src="/images/istanbul-bursa-hero.jpg"
                alt="Osmanlı Başkentleri Turu"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020814]/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-xs md:text-sm">
                <div>
                  <div className="text-[#f4b41a] font-semibold uppercase tracking-[0.2em]">
                    Hafta Sonu Çıkışlı
                  </div>
                  <div className="text-slate-50 font-semibold text-sm md:text-base">
                    İstanbul &amp; Bursa Günübirlik
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Tarihler: Mart – Haziran 2025
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-300">Kişi Başı</div>
                  <div className="text-lg md:text-xl font-bold text-[#f4b41a]">
                    ₺1.499
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/tur/istanbul-bursa-gunubirlik"
            className="absolute -bottom-6 -left-4 hidden md:block bg-[#020814]/95 border border-[#f4b41a]/70 rounded-xl px-4 py-3 text-[11px] text-slate-200 shadow-lg hover:border-[#ffd44f] transition"
          >
            <div className="font-semibold text-[#f4b41a]">
              En çok tercih edilen tur
            </div>
            <div>Detaylar için tıklayın →</div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
