// src/components/ContactSection.jsx
import React from "react";
import { Phone, MapPin, Mail, MessageCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const WHATSAPP_NUMBER = "31621525757";

const ContactSection = () => {
  const handleMockSubmit = (e) => {
    e.preventDefault();
    toast.success(
      "Talebiniz demo olarak alındı. Fuar süresince size en kısa sürede dönüş sağlanacaktır."
    );
  };

  return (
    <section className="bg-[#f6f7f9] border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-[1.3fr,1fr] gap-10 items-start">
        {/* Form */}
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#f4b41a]">
            İletişim
          </p>
          <h2 className="text-xl md:text-2xl font-bold mb-3 text-slate-900">
            Fuarda Yüz Yüze, Online’da Her Yerde
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Tur programları, kontenjan ve özel grup talepleri için formu
            doldurabilir veya direkt WhatsApp’tan yazabilirsiniz.
          </p>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <form className="space-y-3 text-sm" onSubmit={handleMockSubmit}>
              <div>
                <label className="block text-xs mb-1 text-slate-600">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#f4b41a] focus:ring-1 focus:ring-[#f4b41a]"
                  placeholder="Adınız Soyadınız"
                  required
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-slate-600">
                  Telefon
                </label>
                <input
                  type="tel"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#f4b41a] focus:ring-1 focus:ring-[#f4b41a]"
                  placeholder="05xx xxx xx xx"
                  required
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-slate-600">
                  Notunuz
                </label>
                <textarea
                  rows="3"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#f4b41a] focus:ring-1 focus:ring-[#f4b41a]"
                  placeholder="Tarih, kişi sayısı, tercih ettiğiniz tur vb."
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#f4b41a] text-white text-xs font-semibold uppercase tracking-wide hover:bg-[#ffd44f] transition"
              >
                <Mail className="w-4 h-4" />
                Talep Gönder (Demo)
              </button>
            </form>
          </div>
        </div>

        {/* Sağ: WhatsApp / Ofis */}
        <div className="space-y-4 text-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold mb-2 text-sm text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              WhatsApp İletişim
            </h3>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-400 transition"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp’tan Yaz
            </a>
            <p className="text-[11px] text-slate-600 mt-2">
              Fuar süresince 09:00 – 22:00 arası anlık dönüş sağlanacaktır.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 shadow-sm space-y-1">
            <h3 className="font-semibold mb-2 text-sm text-slate-900">
              Ofis / Fuar Bilgisi
            </h3>
            <p className="flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Fuar Alanı: [Salon / Stant]
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Merkez Ofis: İstanbul
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3 h-3" /> 0 (xxx) xxx xx xx
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3 h-3" /> info@elitetravel.com
            </p>
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
