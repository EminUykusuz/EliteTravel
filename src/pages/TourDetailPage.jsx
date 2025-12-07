// src/pages/TourDetailPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { tours } from "../data/tours.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const TourDetailPage = () => {
  const { slug } = useParams();
  const tour = tours.find((t) => t.slug === slug);

  if (!tour) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Tur bulunamadı</h1>
          <p className="text-slate-300 mb-4">
            Aradığınız tur yayından kaldırılmış veya henüz eklenmemiş olabilir.
          </p>
          <Link
            to="/"
            className="inline-flex px-4 py-2 rounded-full bg-[#f4b41a] text-[#020814] text-xs font-semibold hover:bg-[#ffd44f] transition"
          >
            Ana sayfaya dön
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const whatsappLink = `https://wa.me/${tour.whatsappNumber}?text=${encodeURIComponent(
    `Merhaba, "${tour.title}" turu hakkında bilgi almak istiyorum.`
  )}`;

  return (
    <>
      <Navbar />

      <section className="bg-[#020814] border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-10">
          <Link
            to="/"
            className="inline-flex text-xs text-slate-400 hover:text-[#f4b41a] mb-4"
          >
            ← Tüm Turlara Dön
          </Link>

          <div className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
            {/* SOL */}
            <div>
              <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-800 mb-4">
                <img
                  src={tour.heroImage || tour.thumbnail}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] mb-3">
                <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-200">
                  {tour.duration}
                </span>
                <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-200">
                  Kalkış: {tour.departureCity}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {tour.title}
              </h1>
              <p className="text-sm text-slate-300 mb-4">{tour.summary}</p>

              {/* Highlights */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2">Öne Çıkanlar</h2>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {tour.highlights?.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              {/* Program */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2">
                  Tur Programı (Örnek)
                </h2>
                <div className="space-y-3">
                  {tour.itinerary?.map((step, i) => (
                    <div
                      key={i}
                      className="border border-slate-800 rounded-xl p-3 text-xs bg-slate-900/60"
                    >
                      <div className="text-[#f4b41a] font-semibold mb-1">
                        {step.day}
                      </div>
                      <div className="font-semibold mb-1">{step.title}</div>
                      <p className="text-slate-300">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dahil / Hariç */}
              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-800 rounded-xl p-3 bg-slate-900/60">
                  <h3 className="text-sm font-semibold mb-2 text-emerald-400">
                    Fiyata Dahil Olan Hizmetler
                  </h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {tour.included?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="border border-slate-800 rounded-xl p-3 bg-slate-900/60">
                  <h3 className="text-sm font-semibold mb-2 text-rose-400">
                    Fiyata Dahil Olmayanlar
                  </h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {tour.excluded?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 mt-4">
                *Program akışı, hava ve yol şartlarına göre rehber tarafından
                küçük değişikliklerle güncellenebilir. Kesin programı kayıt
                sırasında sözleşme ile alabilirsiniz.
              </p>
            </div>

            {/* SAĞ – Fiyat kutusu */}
            <aside className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sticky top-20 self-start">
              <div className="text-xs text-slate-300 mb-1">
                Kişi Başı Başlangıç Fiyatı
              </div>
              <div className="text-3xl font-bold text-[#f4b41a] mb-2">
                ₺{tour.price.toLocaleString("tr-TR")}
              </div>
              <div className="text-[11px] text-slate-400 mb-4">
                {tour.datesText}
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-semibold uppercase tracking-wide hover:bg-emerald-400 transition mb-2"
              >
                WhatsApp’tan Bilgi Al
              </a>
              <button
                type="button"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-full border border-[#0b3954] text-xs font-semibold uppercase tracking-wide hover:border-[#f4b41a] hover:text-[#f4b41a] transition mb-4"
              >
                Fuar Alanında Görüşmek İstiyorum
              </button>

              <div className="text-[11px] text-slate-400 space-y-1">
                <p>• Online kayıtlarda yeriniz 24 saate kadar ön rezerve edilir.</p>
                <p>• Kesin kayıt için sözleşme ve ödeme teyidi gereklidir.</p>
                <p>• Grup ve okul turları için özel fiyat alınabilir.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TourDetailPage;
