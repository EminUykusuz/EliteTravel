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
        <main className="bg-[#f3f4f6] min-h-[60vh]">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-2 text-slate-900">
              Tur bulunamadı
            </h1>
            <p className="text-slate-600 mb-4">
              Aradığınız tur yayından kaldırılmış veya henüz eklenmemiş olabilir.
            </p>
            <Link
              to="/turlar"
              className="inline-flex px-4 py-2 rounded-full bg-[#f4b41a] text-white text-xs font-semibold hover:bg-[#ffd44f] transition"
            >
              Tüm turlara dön
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currencySymbol = tour.currency === "EUR" ? "€" : "₺";

  const whatsappLink = `https://wa.me/${tour.whatsappNumber}?text=${encodeURIComponent(
    `Merhaba, "${tour.title}" turu hakkında bilgi almak istiyorum.`
  )}`;

  return (
    <>
      <Navbar />
      <section className="bg-[#f3f4f6] border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-10">
          <Link
            to="/turlar"
            className="inline-flex text-xs text-slate-600 hover:text-[#f4b41a] mb-4"
          >
            ← Tüm turlara dön
          </Link>

          <div className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
            {/* SOL */}
            <div>
              <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 mb-4 bg-white shadow-sm">
                <img
                  src={tour.heroImage || tour.thumbnail}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-wrap gap-3 text-[11px] mb-3">
                {tour.duration && (
                  <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {tour.duration}
                  </span>
                )}
                {tour.departureCity && (
                  <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Kalkış: {tour.departureCity}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900">
                {tour.title}
              </h1>
              <p className="text-sm text-slate-700 mb-4">{tour.summary}</p>

              {tour.highlights && tour.highlights.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold mb-2 text-slate-900">
                    Öne Çıkanlar
                  </h2>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    {tour.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {tour.itinerary && tour.itinerary.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold mb-2 text-slate-900">
                    Tur Programı (Örnek Akış)
                  </h2>
                  <div className="space-y-3">
                    {tour.itinerary.map((step, i) => (
                      <div
                        key={i}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-white shadow-sm"
                      >
                        <div className="text-[#f4b41a] font-semibold mb-1">
                          {step.day}
                        </div>
                        <div className="font-semibold mb-1 text-slate-900">
                          {step.title}
                        </div>
                        <p className="text-slate-700">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 text-xs">
                {tour.included && (
                  <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-sm">
                    <h3 className="text-sm font-semibold mb-2 text-emerald-500">
                      Fiyata Dahil Olan Hizmetler
                    </h3>
                    <ul className="list-disc list-inside text-slate-700 space-y-1">
                      {tour.included.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excluded && (
                  <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-sm">
                    <h3 className="text-sm font-semibold mb-2 text-rose-500">
                      Fiyata Dahil Olmayanlar
                    </h3>
                    <ul className="list-disc list-inside text-slate-700 space-y-1">
                      {tour.excluded.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500 mt-4">
                *Program akışı hava, yol ve resmi durumlara göre rehber tarafından
                küçük değişikliklerle güncellenebilir. Kesin program kayıt
                sırasında sözleşme ile paylaşılır.
              </p>
            </div>

            {/* SAĞ – Fiyat kutusu */}
            <aside className="bg-white border border-slate-200 rounded-2xl p-4 sticky top-20 self-start shadow-sm">
              <div className="text-xs text-slate-600 mb-1">
                Kişi Başı Başlangıç Fiyatı
              </div>
              <div className="text-3xl font-bold text-[#f4b41a] mb-2">
                {currencySymbol}
                {tour.price.toLocaleString("tr-TR")}
              </div>
              {tour.datesText && (
                <div className="text-[11px] text-slate-500 mb-4">
                  {tour.datesText}
                </div>
              )}

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wide hover:bg-emerald-400 transition mb-2"
              >
                WhatsApp’tan Bilgi Al
              </a>

              <button
                type="button"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-full border border-[#0b3954] text-xs font-semibold uppercase tracking-wide text-slate-800 hover:border-[#f4b41a] hover:text-[#f4b41a] transition mb-4"
              >
                Fuar Alanında Görüşmek İstiyorum
              </button>

              <div className="text-[11px] text-slate-500 space-y-1">
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
