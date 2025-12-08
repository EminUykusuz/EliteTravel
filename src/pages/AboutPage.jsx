// src/pages/AboutPage.jsx
import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <main className="bg-[#f3f4f6] min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.25em] text-[#f4b41a] mb-2">
            Hakkımızda
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Elite Travel · Osmanlı Başkentleri Uzmanı
          </h1>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            Elite Travel, özellikle Osmanlı tarihine ve manevi mirasa ilgi duyan
            misafirler için İstanbul, Bursa, Bilecik/Söğüt ve Edirne ekseninde
            özenle hazırlanmış tur programları sunar. Fuara özel olarak
            hazırlanan Osmanlı Başkentleri turlarımız, tarih anlatımı güçlü,
            konforlu ve güvenli bir deneyim sunmayı hedeflemektedir.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            Programlarımızda, Dr. Ahmet Anapalı gibi alanında uzman isimlerle
            çalışarak sadece seyahat değil, aynı zamanda bakış açısı kazandıran
            bir yolculuk sunuyoruz. Uçuş, konaklama, ulaşım ve rehberlik
            hizmetlerini bir araya getirerek, misafirlerimizin sadece deneyime
            odaklanmasını sağlıyoruz.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Detaylı bilgi ve grup/kurumsal talepler için bizimle iletişime
            geçebilir, fuar alanındaki standımızı ziyaret edebilirsiniz.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
