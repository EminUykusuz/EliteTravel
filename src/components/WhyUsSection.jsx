// src/components/WhyUsSection.jsx
import React from "react";

const items = [
  {
    icon: "🏛️",
    title: "Tarih Odaklı Anlatım",
    text: "Osmanlı’nın kuruluş dönemine odaklanan detaylı rehberlik hizmeti.",
  },
  {
    icon: "🚌",
    title: "Konforlu Ulaşım",
    text: "Turizm belgeli araçlar, koltuk arkası USB ve klima ile rahat yolculuk.",
  },
  {
    icon: "🛡️",
    title: "Kurumsal Güvence",
    text: "TURSAB belgeli acente, resmi sözleşme ve fatura ile güvenli kayıt.",
  },
  {
    icon: "📞",
    title: "7/24 İletişim",
    text: "WhatsApp hattı üzerinden hızlı dönüş; fuar alanında yüz yüze destek.",
  },
];

const WhyUsSection = () => {
  return (
    <section id="neden" className="bg-[#0f4b41a] border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#f4b41a]">
            Neden Elite travel?
          </p>
          <h2 className="text-xl md:text-2xl font-bold">
            Kurumsal, Güvenilir ve Deneyimli
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-5 text-sm">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-4"
            >
              <div className="text-[#f4b41a] text-lg mb-2">
                {item.icon}
              </div>
              <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
              <p className="text-xs text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
