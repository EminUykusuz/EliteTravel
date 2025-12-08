// src/data/tours.js

export const tours = [
  {
    id: 1,
    slug: "osmanli-baskentleri-sogut",
    type: "Osmanlı Başkentleri",
    title: "Osmanlı Başkentleri Turu (İstanbul · Bursa · Bilecik/Söğüt)",
    duration: "5 Gece · 6 Gün",
    departureCity: "Düsseldorf",
    datesText: "21 – 26 Kasım 2025",
    price: 850,
    currency: "EUR",
    whatsappNumber: "31621525757",
    thumbnail: "/images/osmanli-sogut-thumb.jpg",
    heroImage: "/images/osmanli-sogut-hero.jpg",
    summary:
      "Dr. Ahmet Anapalı rehberliğinde İstanbul, Bursa ve Bilecik/Söğüt’ü kapsayan 5 gece 6 günlük tarih ve maneviyat yolculuğu. Düsseldorf çıkışlı, uçak + konaklama + şehir turları dahil.",
    highlights: [
      "Dr. Ahmet Anapalı eşliğinde özel anlatımlar",
      "İstanbul, Bursa ve Söğüt’te rehberli şehir turları",
      "4 ve 5 yıldızlı otellerde 5 gece kahvaltı dahil konaklama",
      "Düsseldorf – Sabiha Gökçen gidiş-dönüş uçak bileti",
      "Özel araçla konforlu ulaşım",
    ],
    itinerary: [
      {
        day: "1. Gün",
        title: "Düsseldorf → İstanbul → Söğüt → Bursa",
        description:
          "Düsseldorf buluşma, Düsseldorf–Sabiha Gökçen uçuşu, Söğüt’e transfer, Ertuğrul Gazi ziyareti ve akşam yemeği, ardından Bursa’ya geçiş ve otele yerleşme.",
      },
      {
        day: "2. Gün",
        title: "Bursa Tarih ve Maneviyat Turu",
        description:
          "Osman Gazi, Orhan Gazi, Murad Hüdavendigâr, Yıldırım Bayezid, Çelebi Mehmet (Yeşil Türbe), II. Murad, Ulu Cami, Karagöz Müzesi, Panorama 1326 ve Emir Sultan ziyaretleri.",
      },
      {
        day: "3–5. Gün",
        title: "İstanbul Tarihi Yarımada ve Maneviyat Güzergahları",
        description:
          "Yedikule, Panorama 1453, Topkapı Sarayı, Ayasofya, Süleymaniye, Eyüp Sultan ve daha birçok durakta rehber eşliğinde tarih yolculuğu.",
      },
      {
        day: "6. Gün",
        title: "İstanbul → Düsseldorf",
        description:
          "Serbest zaman ve alışveriş imkanı sonrası havalimanına transfer ve Düsseldorf’a dönüş uçuşu.",
      },
    ],
    included: [
      "Düsseldorf – Sabiha Gökçen gidiş-dönüş uçak bileti",
      "25 + 8 kg bagaj hakkı",
      "4 ve 5 yıldızlı otellerde 5 gece kahvaltı dahil konaklama",
      "2 kişilik odalarda konaklama",
      "İstanbul, Bursa ve Söğüt’te şehir turları",
      "Tur boyunca özel araç ile ulaşım",
      "Profesyonel rehberlik (Dr. Ahmet Anapalı)",
    ],
    excluded: [
      "Müze ve ören yeri giriş ücretleri",
      "Öğle ve akşam yemekleri",
      "Kişisel harcamalar",
      "Tek kişilik oda farkı (€150,-)",
    ],
  },
  {
    id: 2,
    slug: "osmanli-baskentleri-edirne",
    type: "Osmanlı Başkentleri",
    title: "Osmanlı Başkentleri Turu (İstanbul · Bursa · Edirne)",
    duration: "5 Gece · 6 Gün",
    departureCity: "Düsseldorf",
    datesText: "21 – 26 Kasım 2025",
    price: 850,
    currency: "EUR",
    whatsappNumber: "31621525757",
    thumbnail: "/images/osmanli-edirne-thumb.jpg",
    heroImage: "/images/osmanli-edirne-hero.jpg",
    summary:
      "İstanbul, Bursa ve Edirne’yi kapsayan, Selimiye ve Boğaz turu içeren özel Osmanlı Başkentleri programı. Düsseldorf çıkışlı, sınırlı kontenjanlı fuar özel turu.",
    highlights: [
      "İstanbul, Bursa ve Edirne’de rehberli şehir turları",
      "Boğaz’da tekne turu",
      "4 yıldızlı otelde 5 gece kahvaltı dahil konaklama",
      "Düsseldorf – Sabiha Gökçen uçuşu dahil",
      "Dr. Ahmet Anapalı eşliğinde tarih ve maneviyat",
    ],
    itinerary: [
      {
        day: "1. Gün",
        title: "Düsseldorf → İstanbul",
        description:
          "Düsseldorf’ta buluşma, uçuş ve İstanbul otele yerleşme, kısa şehir tanıtımı.",
      },
      {
        day: "2. Gün",
        title: "Bursa Ziyaretleri",
        description:
          "Bursa’ya hareket, Osman Gazi ve Orhan Gazi türbeleri, Ulu Cami, tarihi çarşılar ve panoramik tur.",
      },
      {
        day: "3. Gün",
        title: "Edirne · Selimiye ve Osmanlı Mirası",
        description:
          "Selimiye Camii, Eski Camii, Üç Şerefeli Camii ve şehir gezisi; akşam İstanbul’a dönüş.",
      },
      {
        day: "4. Gün",
        title: "İstanbul Klasik Tur + Boğaz Gezisi",
        description:
          "Tarihi yarımada ziyaretleri ve Boğaz’da tekne turu; akşam serbest zaman.",
      },
      {
        day: "5. Gün",
        title: "Serbest Zaman ve Alışveriş",
        description:
          "İsteğe bağlı ekstra geziler ve alışveriş imkanı.",
      },
      {
        day: "6. Gün",
        title: "İstanbul → Düsseldorf",
        description: "Havalimanına transfer ve Düsseldorf’a dönüş.",
      },
    ],
    included: [
      "Düsseldorf – Sabiha Gökçen gidiş-dönüş uçak bileti",
      "20 + 8 kg bagaj hakkı",
      "4 yıldızlı otelde 5 gece kahvaltı dahil konaklama",
      "2 kişilik odalarda konaklama",
      "İstanbul, Bursa ve Edirne’de şehir turları",
      "Boğaz’da tekne turu",
      "Tur boyunca özel araç ile ulaşım",
    ],
    excluded: [
      "Müze ve ören yeri giriş ücretleri (MüzeKart tavsiye edilir)",
      "Öğle ve akşam yemekleri",
      "Kişisel harcamalar",
      "Tek kişilik oda farkı (€150,-)",
    ],
  },
];
