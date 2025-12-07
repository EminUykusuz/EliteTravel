// src/data/tours.js

export const tours = [
  {
    id: 1,
    slug: "istanbul-bursa-gunubirlik",
    title: "İstanbul & Bursa Osmanlı İzleri Turu",
    shortTitle: "İstanbul & Bursa",
    duration: "1 Gün · Günübirlik",
    type: "Günübirlik",
    price: 1499,
    currency: "TRY",
    departureCity: "İstanbul",
    datesText: "Seçili hafta sonları · Mart - Haziran 2025",
    thumbnail: "/images/istanbul-bursa-card.jpg", // public/images içine at
    heroImage: "/images/istanbul-bursa-hero.jpg",
    summary:
      "İstanbul’dan çıkışlı, Bursa Ulu Camii, Yeşil Türbe, Tophane ve Emir Sultan ziyaretleriyle dolu günübirlik tarih turu.",
    highlights: [
      "İstanbul Avrupa & Anadolu yakasından merkezî kalkış noktaları",
      "Ulu Camii, Yeşil Türbe, Emir Sultan, Tophane ve tarihi çarşı",
      "Profesyonel rehber eşliğinde Osmanlı tarihi anlatımı",
      "Konforlu turizm araçları ile ulaşım",
    ],
    included: [
      "Lüks araçlarla gidiş–dönüş ulaşım",
      "Profesyonel rehberlik hizmeti",
      "Seyahat sigortası",
    ],
    excluded: [
      "Öğle ve akşam yemekleri",
      "Kişisel harcamalar",
      "Müze ve ören yeri giriş ücretleri",
    ],
    itinerary: [
      {
        day: "Sabah",
        title: "İstanbul’dan Hareket",
        description:
          "Belirlenen noktalardan misafirlerin alınması, araç içi bilgilendirme ve Bursa’ya hareket.",
      },
      {
        day: "Öğle",
        title: "Ulu Camii & Çevresi",
        description:
          "Ulu Camii ziyareti, rehber eşliğinde anlatım, ardından tarihi çarşı ve serbest zaman.",
      },
      {
        day: "Öğleden Sonra",
        title: "Yeşil Türbe & Emir Sultan",
        description:
          "Yeşil Türbe, Emir Sultan ve panoramik şehir turu. Fotoğraf molaları.",
      },
      {
        day: "Akşam",
        title: "İstanbul’a Dönüş",
        description:
          "Bursa’dan hareket, İstanbul’a dönüş ve bir sonraki turda görüşmek üzere vedalaşma.",
      },
    ],
    whatsappNumber: "905555555555",
  },
  {
    id: 2,
    slug: "bursa-bilecik-sogut-konaklamali",
    title: "Bursa · Bilecik · Söğüt Osmanlı Başlangıç Rotası",
    shortTitle: "Bursa · Bilecik · Söğüt",
    duration: "2 Gün · 1 Gece Konaklamalı",
    type: "Konaklamalı",
    price: 2899,
    currency: "TRY",
    departureCity: "İstanbul",
    datesText: "Belirli hafta sonları · 2025",
    thumbnail: "/images/bursa-bilecik-sogut-card.jpg",
    heroImage: "/images/bursa-bilecik-sogut-hero.jpg",
    summary:
      "Osmanlı’nın kuruluş izlerini Bursa, Bilecik ve Söğüt hattında derinlemesine deneyimleyebileceğiniz tarih turu.",
    highlights: [
      "Ertuğrul Gazi ve Şeyh Edebali türbeleri",
      "Söğüt çarşı ve Osmanlı başlangıç coğrafyası",
      "Merkezi konumlu otelde 1 gece konaklama",
      "Rehber eşliğinde detaylı tarih bilgisi",
    ],
    included: [
      "Lüks araçlarla ulaşım",
      "1 gece otel konaklaması (yarım pansiyon)",
      "Profesyonel rehberlik",
      "Seyahat sigortası",
    ],
    excluded: [
      "Öğle yemekleri",
      "Müze giriş ücretleri",
      "Kişisel harcamalar",
    ],
    itinerary: [
      {
        day: "1. Gün Sabah",
        title: "İstanbul → Bursa",
        description:
          "İstanbul’dan hareket, Bursa şehir gezisi, Ulu Camii, Yeşil Türbe ve serbest zaman.",
      },
      {
        day: "1. Gün Akşam",
        title: "Otele Yerleşme",
        description:
          "Otele giriş, akşam yemeği ve serbest zaman.",
      },
      {
        day: "2. Gün Sabah",
        title: "Bursa → Bilecik → Söğüt",
        description:
          "Şeyh Edebali, Ertuğrul Gazi türbeleri, Söğüt ve çevre gezileri.",
      },
      {
        day: "2. Gün Akşam",
        title: "Dönüş",
        description:
          "İstanbul’a dönüş yolculuğu, molalar ve tur sonu.",
      },
    ],
    whatsappNumber: "905555555555",
  },
  {
    id: 3,
    slug: "tam-osmanli-baskentleri-rotasi",
    title: "Tam Osmanlı Başkentleri Rotası",
    shortTitle: "Tüm Başkentler",
    duration: "3 Gün · 2 Gece Konaklamalı",
    type: "Konaklamalı",
    price: 4499,
    currency: "TRY",
    departureCity: "İstanbul",
    datesText: "Sınırlı çıkış tarihleri · 2025",
    thumbnail: "/images/full-rotasyon-card.jpg",
    heroImage: "/images/full-rotasyon-hero.jpg",
    summary:
      "İstanbul, Bursa, Bilecik ve Söğüt’ü kapsayan kapsamlı Osmanlı başkentleri turu.",
    highlights: [
      "Tüm Osmanlı başkentlerine tek turda ziyaret",
      "2 gece otel konaklaması",
      "Detaylı tarih anlatımları",
      "Küçük grup kontenjanı ile daha rahat deneyim",
    ],
    included: [
      "Lüks araçlarla ulaşım",
      "2 gece konaklama",
      "Profesyonel rehberlik",
      "Seyahat sigortası",
    ],
    excluded: [
      "Öğle yemekleri",
      "Müze girişleri",
      "Kişisel harcamalar",
    ],
    itinerary: [
      {
        day: "1. Gün",
        title: "İstanbul & Bursa",
        description: "İstanbul çıkış, Bursa şehir turu ve otele yerleşme.",
      },
      {
        day: "2. Gün",
        title: "Bursa & Bilecik",
        description: "Bursa’dan Bilecik’e geçiş, Şeyh Edebali ziyareti ve konaklama.",
      },
      {
        day: "3. Gün",
        title: "Söğüt & Dönüş",
        description: "Söğüt ziyaretleri, Ertuğrul Gazi Türbesi ve İstanbul’a dönüş.",
      },
    ],
    whatsappNumber: "905555555555",
  },
];
