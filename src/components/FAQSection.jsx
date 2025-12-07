// src/components/FAQSection.jsx
import React from "react";

const FAQSection = () => {
  return (
    <section id="sss" className="bg-[#020814] border-t border-slate-800">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#f4b41a]">
            Sıkça Sorulanlar
          </p>
          <h2 className="text-xl md:text-2xl font-bold">
            Sık Sorulan Sorular
          </h2>
        </div>

        <div className="space-y-4 text-sm">
          <details className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <summary className="cursor-pointer font-semibold text-sm">
              Fiyatlara neler dahil?
            </summary>
            <p className="mt-2 text-xs text-slate-300">
              Ulaşım, rehberlik, seyahat sigortası ve seçili turlarda
              konaklama dahildir. Yemekler ve müze girişleri tur detayında
              ayrıca belirtilir.
            </p>
          </details>
          <details className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <summary className="cursor-pointer font-semibold text-sm">
              Ödemeyi nasıl yapabilirim?
            </summary>
            <p className="mt-2 text-xs text-slate-300">
              Fuar alanında yüz yüze, ya da banka/EFT ile ödeme
              yapabilirsiniz. Kayıt sırasında kapora alınır, kalan bakiyeyi
              tur tarihine kadar tamamlayabilirsiniz.
            </p>
          </details>
          <details className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <summary className="cursor-pointer font-semibold text-sm">
              İptal ve iade koşulları nedir?
            </summary>
            <p className="mt-2 text-xs text-slate-300">
              Tur tarihinden belirli gün öncesine kadar ücretsiz iptal
              mümkündür. Detaylı koşullar kayıt formu ve sözleşme ile
              paylaşılır.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
