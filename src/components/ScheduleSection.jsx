// src/components/ScheduleSection.jsx
import React from "react";

const ScheduleSection = () => {
  return (
    <section id="takvim" className="bg-[#020814] border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#f4b41a]">
            Tur Takvimi
          </p>
          <h2 className="text-xl md:text-2xl font-bold">
            2025 Çıkış Tarihleri (Özet)
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Detaylı tarih ve kontenjan için WhatsApp’tan yazabilirsiniz.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="min-w-full text-xs md:text-sm">
            <thead className="bg-slate-900 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Tur</th>
                <th className="px-3 py-2 text-left font-semibold">Ay</th>
                <th className="px-3 py-2 text-left font-semibold">Günler</th>
                <th className="px-3 py-2 text-left font-semibold">
                  Fiyat (Kişi Başı)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="bg-[#020814]">
                <td className="px-3 py-2">İstanbul &amp; Bursa Günübirlik</td>
                <td className="px-3 py-2">Mart · Nisan · Mayıs</td>
                <td className="px-3 py-2">Cumartesi / Pazar</td>
                <td className="px-3 py-2 text-[#f4b41a] font-semibold">
                  ₺1.499
                </td>
              </tr>
              <tr className="bg-[#020814]/90">
                <td className="px-3 py-2">
                  Bursa · Bilecik · Söğüt (1 Gece)
                </td>
                <td className="px-3 py-2">Nisan · Mayıs · Haziran</td>
                <td className="px-3 py-2">Belirli hafta sonları</td>
                <td className="px-3 py-2 text-[#f4b41a] font-semibold">
                  ₺2.899
                </td>
              </tr>
              <tr className="bg-[#020814]">
                <td className="px-3 py-2">
                  Tam Osmanlı Başkentleri Rotası (2 Gece)
                </td>
                <td className="px-3 py-2">Mayıs · Haziran</td>
                <td className="px-3 py-2">Sınırlı tarih</td>
                <td className="px-3 py-2 text-[#f4b41a] font-semibold">
                  ₺4.499
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-400 mt-3">
          *Fiyatlar fuar dönemi için geçerlidir. Güncel fiyat ve müsaitlik için
          mutlaka teyit alınız.
        </p>
      </div>
    </section>
  );
};

export default ScheduleSection;
