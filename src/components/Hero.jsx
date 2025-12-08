// src/components/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

const heroSlides = [
  {
    image: "/images/osmanli-sogut-hero.jpg",
    title: "Osmanlı Başkentleri · Söğüt",
    subtitle: "İstanbul · Bursa · Bilecik/Söğüt · 5 Gece 6 Gün",
    price: "€850",
  },
  {
    image: "/images/osmanli-edirne-hero.jpg",
    title: "Osmanlı Başkentleri · Edirne",
    subtitle: "İstanbul · Bursa · Edirne · Boğaz Turu Dahil",
    price: "€850",
  },
];

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-[#e5edf4] via-[#f3f4f6] to-[#f6f7f9]">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        {/* Sol */}
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-[#f4b41a] text-xs font-semibold uppercase tracking-[0.25em]">
            Fuara Özel Kültür Turları
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-[#0b3954]">
            Osmanlı Başkentlerini{" "}
            <span className="text-[#f4b41a]">Elite Travel</span> ile keşfedin
          </h1>
          <p className="text-slate-700 text-sm md:text-base max-w-xl">
            Dr. Ahmet Anapalı rehberliğinde İstanbul, Bursa, Bilecik/Söğüt ve
            Edirne’yi kapsayan, tarih ve maneviyat dolu turlar. Düsseldorf
            çıkışlı, fuara özel kontenjanlarla.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/turlar"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#f4b41a] text-white text-sm font-semibold hover:bg-[#ffd44f] transition"
            >
              Turları Gör
            </Link>
            <Link
              to="/iletisim"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-[#0b3954] text-sm font-semibold text-[#0b3954] hover:border-[#f4b41a] hover:text-[#f4b41a] transition"
            >
              WhatsApp’tan Sor
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 text-[11px] text-slate-600">
            <div>
              <div className="font-semibold text-slate-900">Fuara Özel</div>
              <div>21 – 26 Kasım · 5 Gece 6 Gün</div>
            </div>
            <div>
              <div className="font-semibold text-slate-900">Dr. Ahmet Anapalı</div>
              <div>Rehber eşliğinde anlatımlı program</div>
            </div>
          </div>
        </motion.div>

        {/* Sağ – slider */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        >
          <div className="bg-white border border-slate-200 rounded-3xl p-3 md:p-4 shadow-md">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              loop
              className="rounded-2xl"
            >
              {heroSlides.map((slide, i) => (
                <SwiperSlide key={i}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-xs md:text-sm">
                      <div>
                        <div className="text-[#f4b41a] font-semibold uppercase tracking-[0.2em]">
                          Osmanlı Başkentleri
                        </div>
                        <div className="text-white font-semibold text-sm md:text-base drop-shadow">
                          {slide.title}
                        </div>
                        <div className="text-slate-100 text-[11px]">
                          {slide.subtitle}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-slate-100">
                          Başlayan fiyatlarla
                        </div>
                        <div className="text-lg md:text-xl font-bold text-[#f4b41a] drop-shadow">
                          {slide.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
