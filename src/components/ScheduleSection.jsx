// src/components/ScheduleSection.jsx
import React from "react";

const schedule = [
  {
    day: "21 Kasım Cuma",
    rows: [
      { time: "05.00 – 05.30", text: "Düsseldorf buluşma" },
      { time: "07.30 – 12.45", text: "Düsseldorf → SAW PC 1006 uçuşu" },
      { time: "14.00 – 16.30", text: "Söğüt’e transfer" },
      {
        time: "16.30 – 19.30",
        text: "Ertuğrul Gazi ziyareti ve akşam yemeği",
      },
      { time: "19.30 – 21.30", text: "Bursa’ya transfer" },
      { time: "21.30 –", text: "Otel check-in ve istirahat" },
    ],
  },
  {
    day: "22 Kasım Cumartesi",
    rows: [
      { time: "08.00 – 08.30", text: "Otel check-out" },
      {
        time: "08.30 – 18.00",
        text:
          "Bursa programı: Osman Gazi, Orhan Gazi, Murad Hüdavendigâr, Yıldırım Bayezid, Çelebi Mehmet (Yeşil Türbe), II. Murad, Ulu Cami, Karagöz Müzesi, Panorama 1326, Emir Sultan ve şehir turu",
      },
      { time: "18.00 – 20.00", text: "Akşam yemeği" },
      {
        time: "20.00 – 22.00",
        text: "İstanbul’a transfer ve otele yerleşme",
      },
    ],
  },
  {
    day: "23 Kasım Pazar",
    rows: [
      {
        time: "08.30 – 19.00",
        text:
          "İstanbul programı: Yedikule, Panorama 1453, Topkapı Sarayı, Ayasofya",
      },
      { time: "19.00 – 21.00", text: "Akşam yemeği" },
      { time: "21.00 –", text: "Serbest zaman" },
    ],
  },
  {
    day: "24 Kasım Pazartesi",
    rows: [
      {
        time: "08.30 – 19.00",
        text:
          "İstanbul programı: II. Abdülhamid Han, Süleymaniye Camii, Ebul Vefa, Şehzadebaşı Camii, Fatih Camii, Yavuz Sultan Selim Camii, Eyüp Sultan, Cülus Yolu",
      },
      { time: "19.00 – 21.00", text: "Akşam yemeği" },
      { time: "21.00 –", text: "Serbest zaman" },
    ],
  },
  {
    day: "25 Kasım Salı",
    rows: [
      {
        time: "08.00 – 19.00",
        text:
          "İstanbul programı: Dolmabahçe, Barbaros Hayreddin Paşa ve Yıldız Sarayı",
      },
      { time: "19.00 – 21.00", text: "Akşam yemeği" },
      { time: "21.00 –", text: "Serbest zaman" },
    ],
  },
  {
    day: "26 Kasım Çarşamba",
    rows: [
      { time: "10.30 – 11.00", text: "Otel check-out" },
      { time: "11.00 – 13.30", text: "Serbest zaman" },
      { time: "13.30 – 15.30", text: "Havalimanına transfer" },
      { time: "17.35 – 18.55", text: "SAW → Düsseldorf PC 1005 uçuşu" },
      { time: "19.00 –", text: "Vedalaşma" },
    ],
  },
];

const ScheduleSection = () => {
  return (
    <section id="takvim" className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Başlık */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#f4b41a]">
            Tur Programı · Gün Gün
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Osmanlı Başkentleri Turu Akış Planı
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
            Aşağıda örnek program 21 – 26 Kasım tarihli tur için saat saat
            belirtilmiştir. Benzer turlarda küçük saat/güzergâh değişiklikleri
            olabilir.
          </p>
        </div>

        {/* Tablo */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-xs md:text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="w-32 px-3 py-2 text-left font-semibold">
                  Saat
                </th>
                <th className="px-3 py-2 text-left font-semibold">Program</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {schedule.map((dayBlock, i) => (
                <React.Fragment key={i}>
                  {/* Gün başlığı satırı */}
                  <tr className="bg-slate-50">
                    <td className="px-3 py-2 text-[11px] font-semibold text-[#0b3954]">
                      {/* boş bırakıyoruz, sadece gün başlığı */}
                    </td>
                    <td className="px-3 py-2 text-[12px] font-semibold text-slate-900">
                      {dayBlock.day}
                    </td>
                  </tr>
                  {/* Gün içi satırlar */}
                  {dayBlock.rows.map((row, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="px-3 py-2 align-top text-[11px] text-slate-700 whitespace-nowrap">
                        {row.time}
                      </td>
                      <td className="px-3 py-2 text-[11px] md:text-xs text-slate-700 leading-relaxed">
                        {row.text}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 mt-3">
          *Program akışı hava, yol ve resmi programlara göre rehber tarafından
          küçük değişikliklerle güncellenebilir. Kesin program kayıt esnasında
          sözleşme ile paylaşılır.
        </p>
      </div>
    </section>
  );
};

export default ScheduleSection;
