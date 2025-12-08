// src/components/FAQSection.jsx
import React from "react";

const FAQSection = () => {
  return (
    <section className="bg-[#f6f7f9] border-t border-slate-200">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#f4b41a]">
            Sıkça Sorulanlar
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Sık Sorulan Sorular
          </h2>
        </div>

        <div className="space-y-4 text-sm">
          <details className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <summary className="cursor-pointer font-semibold text-slate-900">
              Ücrete neler dahil?
            </summary>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Gidiş-dönüş uçak bileti, belirtilen otellerde kahvaltı dahil
              konaklama, şehir içi ulaşımlar ve programda belirtilen rehberlik
              hizmetleri dahildir. Müze girişleri ve öğle/akşam yemekleri notlar
              kısmında ayrıca belirtilir.
            </p>
          </details>

          <details className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <summary className="cursor-pointer font-semibold text-slate-900">
              Ödemeyi nasıl yapabilirim?
            </summary>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Fuar alanında yüz yüze, banka/EFT ile veya önceden anlaşılmış
              taksit imkânlarıyla ödeme yapabilirsiniz. Detaylar için WhatsApp
              üzerinden bilgi alabilirsiniz.
            </p>
          </details>

          <details className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <summary className="cursor-pointer font-semibold text-slate-900">
              İptal ve iade koşulları nasıldır?
            </summary>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Tur tarihinden belirli gün öncesine kadar ücretsiz veya kesintili
              iptal hakları mevcuttur. Net koşullar, kayıt formu ve sözleşme ile
              size yazılı olarak iletilir.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
