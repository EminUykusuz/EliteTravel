export const tours = [
  {
    id: 1,
    slug: "osmanli-baskentleri-bursa-sogut",
    type: "Osmanlı Başkentleri",
    title: "Osmanlı Başkentleri Turu (İstanbul · Bursa · Bilecik/Söğüt)",
    duration: "5 Gece · 6 Gün",
    departureCity: "Düsseldorf",
    datesText: "21 – 26 Kasım 2025",
    price: 850,
    currency: "EUR",
    whatsappNumber: "31621525757",
    thumbnail: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a6b?q=80&w=800&auto=format&fit=crop", // İstanbul
    heroImage: "https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=1920&auto=format&fit=crop", // İstanbul Geniş
    summary: "Düsseldorf çıkışlı, Dr. Ahmet Anapalı rehberliğinde tarihin kalbine yolculuk.",
    highlights: [
      "Dr. Ahmet Anapalı ile özel anlatım",
      "Ayasofya-i Kebir Cami-i Şerifi Ziyareti",
      "Bursa Ulu Camii ve Kozahan",
      "Ertuğrul Gazi Türbesi ve Söğüt",
      "Boğaz Turu (Özel Tekne)"
    ],
    itinerary: [
      { day: 1, title: "İstanbul'a Varış", description: "Havalimanında karşılama ve otele transfer." },
      { day: 2, title: "Tarihi Yarımada", description: "Sultanahmet, Ayasofya ve Topkapı Sarayı gezisi." },
      { day: 3, title: "Bursa Yolculuğu", description: "Osmangazi Köprüsü üzerinden Bursa'ya geçiş." },
    ],
    included: ["Uçak Bileti", "5 Yıldızlı Konaklama", "Sabah Kahvaltıları", "Müze Girişleri", "Rehberlik"],
    excluded: ["Öğle ve Akşam Yemekleri", "Şahsi Harcamalar"]
  },
  {
    id: 2,
    slug: "osmanli-baskentleri-edirne",
    type: "Osmanlı Başkentleri",
    title: "Osmanlı Başkentleri Turu (İstanbul · Bursa · Edirne)",
    duration: "4 Gece · 5 Gün",
    departureCity: "Köln",
    datesText: "10 – 15 Aralık 2025",
    price: 850,
    currency: "EUR",
    whatsappNumber: "31621525757",
    thumbnail: "https://images.unsplash.com/photo-1622587676646-0b44d32049e7?q=80&w=800&auto=format&fit=crop", // Edirne Selimiye
    heroImage: "https://images.unsplash.com/photo-1599583236053-f725a3d70659?q=80&w=1920&auto=format&fit=crop",
    summary: "Mimar Sinan'ın ustalık eseri Selimiye ve Osmanlı'nın ikinci başkenti Edirne.",
    highlights: [
      "Selimiye Camii",
      "II. Bayezid Külliyesi",
      "Edirne Ciğeri Tadımı",
      "İstanbul Panoramik Tur"
    ],
    itinerary: [
      { day: 1, title: "Varış", description: "İstanbul'a varış ve Edirne'ye transfer." },
      { day: 2, title: "Edirne Şehir Turu", description: "Tarihi camiler, çarşılar ve köprüler." },
    ],
    included: ["Uçak Bileti", "Konaklama", "Transferler", "Rehberlik"],
    excluded: ["Ekstra Turlar", "Yemekler"]
  }
];