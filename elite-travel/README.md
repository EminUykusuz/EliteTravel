# 🌍 Elite Travel - Tur & Seyahat Rezervasyon Platformu

Elite Travel, kültürel ve tarihi turlar için tasarlanmış modern bir rezervasyon ve yönetim platformudur. Özellikle Osmanlı başkentleri, mimari turlar ve kutsal mekân ziyaretleri için optimize edilmiştir.

## 📋 Proje Hakkında

Bu proje, tur operatörlerinin turlarını çok dilli olarak yönetmesini, kullanıcıların rezervasyon yapmasını ve admin paneli üzerinden tüm içeriğin dinamik olarak kontrol edilmesini sağlayan full-stack bir web uygulamasıdır.

### 🎯 Temel Özellikler

- ✅ **Çok Dilli Destek**: TR, EN, NL, DE dillerinde tam i18n entegrasyonu
- ✅ **Dinamik Tur Yönetimi**: Admin panelinden tur ekleme, düzenleme, silme
- ✅ **SEO Optimizasyonu**: Her sayfa için özel SEO ayarları ve meta tag yönetimi
- ✅ **Google Authenticator 2FA**: İki faktörlü kimlik doğrulama ile güvenli admin girişi
- ✅ **Rezervasyon Sistemi**: Kapsamlı rezervasyon formu ve yönetim paneli
- ✅ **İletişim Modülü**: Müşteri mesajlarını yanıtlama ve takip sistemi
- ✅ **Rehber Yönetimi**: Tur rehberlerinin profil ve detay sayfaları
- ✅ **Galeri ve Medya**: Dosya yükleme ve görsel yönetimi
- ✅ **Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu modern UI
- ✅ **WhatsApp Entegrasyonu**: Hızlı iletişim için floating WhatsApp butonu

## 🛠️ Kullanılan Teknolojiler

### Frontend
- **React 18.3** - UI kütüphanesi
- **Vite** - Hızlı build tool ve dev server
- **React Router DOM v7** - Sayfa yönlendirme
- **i18next** - Çok dilli içerik yönetimi
- **Axios** - HTTP istekleri
- **Framer Motion** - Animasyonlar ve geçişler
- **Swiper** - Carousel ve slider bileşenleri
- **React Helmet Async** - SEO ve meta tag yönetimi
- **React Hot Toast & SweetAlert2** - Bildirim ve modal sistemleri
- **Lucide React** - Modern icon seti
- **Tailwind CSS** - Utility-first CSS framework
- **QRCode** - QR kod oluşturma (2FA için)

### Backend
- **ASP.NET Core 9.0** - Web API framework
- **Entity Framework Core 9.0** - ORM
- **SQL Server** - Veritabanı
- **AutoMapper 12.0** - DTO mapping
- **QRCoder** - QR kod oluşturma (2FA)
- **Swagger** - API dokümantasyonu
- **JWT Authentication** - Token bazlı kimlik doğrulama
- **Google Authenticator** - TOTP 2FA

## 📁 Proje Yapısı

```
Elite Travel/
├── elite-travel/                    # Frontend (React)
│   ├── public/
│   │   └── locales/                # i18n çeviri dosyaları (tr, en, nl, de)
│   ├── src/
│   │   ├── assets/                 # Görseller ve medya
│   │   ├── components/             # React bileşenleri
│   │   │   ├── layout/            # Header, Footer, Navbar
│   │   │   ├── sections/          # Hero, Contact, FAQ vb.
│   │   │   ├── tours/             # Tur kartları ve detayları
│   │   │   └── ui/                # Button, Badge gibi UI bileşenleri
│   │   ├── data/                  # Statik veriler ve fallback
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── i18n/                  # i18next yapılandırması
│   │   ├── pages/                 # Sayfa bileşenleri
│   │   │   ├── admin/            # Admin panel sayfaları
│   │   │   └── ...               # Public sayfalar
│   │   ├── services/              # API servis katmanı
│   │   └── utils/                 # Yardımcı fonksiyonlar
│   └── package.json
│
└── EliteTravel-Backend/             # Backend (ASP.NET Core)
    ├── EliteTravel.API/            # Web API katmanı
    │   ├── Controllers/           # API endpoint'leri
    │   ├── Models/                # Request/Response modelleri
    │   └── wwwroot/              # Statik dosyalar ve upload'lar
    ├── EliteTravel.Core/          # Domain katmanı
    │   ├── DTOs/                 # Data Transfer Objects
    │   ├── Entities/             # Database entity'leri
    │   ├── Repositories/         # Repository interface'leri
    │   └── Services/             # Service interface'leri
    └── EliteTravel.Data/          # Data Access katmanı
        ├── Contexts/             # DbContext
        ├── Migrations/           # EF Core migrations
        └── Repositories/         # Repository implementasyonları
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- .NET 9.0 SDK
- SQL Server
- VS Code veya Visual Studio

### Frontend Kurulumu

```bash
cd elite-travel
npm install
npm run dev
```

Frontend varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

### Backend Kurulumu

1. Connection string'i düzenleyin:
```json
// EliteTravel.API/appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_CONNECTION_STRING"
  }
}
```

2. Migration'ları uygulayın:
```bash
cd EliteTravel-Backend
dotnet ef database update --project EliteTravel.Data --startup-project EliteTravel.API
```

3. Backend'i çalıştırın:
```bash
cd EliteTravel.API
dotnet run
```

Backend varsayılan olarak `https://localhost:7000` adresinde çalışacaktır.

## 🔑 API Endpoints

### Public Endpoints
- `GET /api/tours` - Tüm aktif turları listele
- `GET /api/tours/{slug}` - Tek tur detayı
- `GET /api/categories` - Kategoriler
- `GET /api/guides` - Rehberler
- `POST /api/bookings` - Rezervasyon oluştur
- `POST /api/contacts` - İletişim formu

### Admin Endpoints (Yetkilendirme Gerekli)
- `POST /api/auth/login` - Giriş yap
- `POST /api/auth/setup-2fa` - 2FA kurulumu
- `POST /api/auth/verify-2fa` - 2FA doğrulama
- `GET /api/tours/admin` - Tüm turlar (admin)
- `POST /api/tours` - Tur oluştur
- `PUT /api/tours/{id}` - Tur güncelle
- `DELETE /api/tours/{id}` - Tur sil
- `GET /api/bookings/admin` - Rezervasyonları yönet
- `POST /api/contacts/{id}/reply` - Mesaja yanıt gönder

## 🌐 Çok Dilli Yapı

Proje 4 dili desteklemektedir:
- 🇹🇷 Türkçe (TR)
- 🇬🇧 İngilizce (EN)
- 🇳🇱 Hollandaca (NL)
- 🇩🇪 Almanca (DE)

Çeviri dosyaları `public/locales/{lang}/` klasörlerinde JSON formatında bulunur.

## 🎨 Tasarım Sistemi

Projede Tailwind CSS kullanılarak tutarlı bir tasarım sistemi oluşturulmuştur:
- **Renk Paleti**: Primary (Yeşil), Secondary, Neutral tonlar
- **Typography**: Modern, okunabilir fontlar
- **Spacing**: 4px grid sistemi
- **Components**: Yeniden kullanılabilir UI bileşenleri

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔒 Güvenlik

- JWT token bazlı kimlik doğrulama
- Google Authenticator ile 2FA
- CORS politikaları
- SQL injection koruması (EF Core)
- XSS koruması

## 📝 Geliştirme Notları

### Branch Yapısı
- `main` - Production branch
- `frontend` - Frontend geliştirme
- `backend` - Backend geliştirme

### Commit Mesaj Formatı
```
[Frontend/Backend] Açıklayıcı mesaj
Örnek: [Frontend] Tur detay sayfası eklendi
```

## 🤝 Katkıda Bulunma

Bu proje aktif geliştirme aşamasındadır. Katkılarınızı bekliyoruz!

## 📄 Lisans

Bu proje Elite Travel için özel olarak geliştirilmiştir.

## 📞 İletişim

Elite Travel - [elitetravel@example.com](mailto:elitetravel@example.com)

---

**⭐ Geliştirici:** Full Stack Developer
**📅 Son Güncelleme:** Aralık 2025


