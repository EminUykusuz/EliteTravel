// src/components/ContactSection.jsx
import React from "react";

const WHATSAPP_NUMBER = "905555555555";

const ContactSection = () => {
  return (
    <section id="iletisim" className="bg-[#020814] border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-[1.3fr,1fr] gap-10 items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#f4b41a]">
            İletişim
          </p>
          <h2 className="text-xl md:text-2xl font-bold mb-3">
            Fuarda Yüz Yüze, Online’da Her Yerde
          </h2>
          <p className="text-sm text-slate-300 mb-4">
            Tur programları, kontenjan ve özel grup talepleri için formu
            doldurabilir veya direkt WhatsApp’tan yazabilirsiniz.
          </p>

          <form className="space-y-3 text-sm">
            <div>
              <label className="block text-xs mb-1 text-slate-300">
                Ad Soyad
              </label>
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#f4b41a]"
                placeholder="Adınız Soyadınız"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-slate-300">
                Telefon
              </label>
              <input
                type="tel"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#f4b41a]"
                placeholder="05xx xxx xx xx"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-slate-300">
                Notunuz
              </label>
              <textarea
                rows="3"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#f4b41a]"
                placeholder="Tarih, kişi sayısı, tercih ettiğiniz tur vb."
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#f4b41a] text-[#020814] text-xs font-semibold uppercase tracking-wide hover:bg-[#ffd44f] transition"
            >
              Talep Gönder (Mock)
            </button>
          </form>
        </div>

        <div className="space-y-4 text-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="font-semibold mb-2 text-sm">WhatsApp İletişim</h3>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-slate-950 text-xs font-semibold hover:bg-emerald-400 transition"
            >
              WhatsApp’tan Yaz
            </a>
            <p className="text-[11px] text-slate-300 mt-2">
              Fuar süresince 09:00 – 22:00 arası anlık dönüş sağlanacaktır.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300">
            <h3 className="font-semibold mb-2 text-sm">Ofis / Fuar Bilgisi</h3>
            <p>Fuar Alanı: [Salon / Stant numarası]</p>
            <p>Merkez Ofis: İstanbul</p>
            <p>Telefon: 0 (xxx) xxx xx xx</p>
            <p>E-posta: info@elitetravel.com</p>
          </div>
        </div>
      </div>

      {/* Sabit WhatsApp Butonu */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-4 right-4 z-40 inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 transition"
      >
        <span className="text-2xl">🟢</span>
      </a>
    </section>
  );
};

export default ContactSection;
