# 🌍 Elite Travel - Tur Yönetim Sistemi

Elite Travel, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir tur rezervasyon ve yönetim platformudur. Çok dilli destek, admin paneli, 2FA güvenlik ve SEO optimizasyonu ile tam donanımlı bir çözüm sunar.

## 📋 İçindekiler

- [Proje Yapısı](#-proje-yapısı)
- [Teknolojiler](#-teknolojiler)
- [Özellikler](#-özellikler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [API Endpoints](#-api-endpoints)
- [Çok Dilli Sistem](#-çok-dilli-sistem)
- [Güvenlik](#-güvenlik)

## 🏗 Proje Yapısı

```
Elite Travel/
├── elite-travel/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # React bileşenleri
│   │   │   ├── layout/        # Header, Footer, Navbar
│   │   │   ├── sections/      # Ana sayfa bölümleri
│   │   │   ├── tours/         # Tur kartları ve detaylar
│   │   │   └── ui/            # Yeniden kullanılabilir UI bileşenleri
│   │   ├── pages/             # Sayfa bileşenleri
│   │   │   ├── HomePage.jsx
│   │   │   ├── ToursPage.jsx
│   │   │   ├── TourDetailPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── TwoFactorPage.jsx
│   │   │   └── admin/         # Admin paneli sayfaları
│   │   ├── services/          # API servis katmanı
│   │   ├── hooks/             # Custom React hooks
│   │   ├── i18n/              # Çok dilli yapılandırma
│   │   └── utils/             # Yardımcı fonksiyonlar
│   ├── public/
│   │   └── locales/           # Dil dosyaları (tr, en, de, nl)
│   └── package.json
│
└── EliteTravel-Backend/       # Backend (.NET 9)
    ├── EliteTravel.API/       # Web API
    │   ├── Controllers/       # API Controller'ları
    │   └── wwwroot/uploads/   # Dosya yükleme dizini
    ├── EliteTravel.Core/      # İş mantığı katmanı
    │   ├── DTOs/              # Data Transfer Objects
    │   ├── Entities/          # Veritabanı modelleri
    │   ├── Repositories/      # Repository pattern
    │   └── Services/          # Business logic servisleri
    └── EliteTravel.Data/      # Veri erişim katmanı
```

## 🚀 Teknolojiler

### Frontend
- **React 18.3** - Modern UI kütüphanesi
- **Vite** - Hızlı build tool
- **React Router v7** - Routing
- **i18next** - Çok dilli destek (TR, EN, DE, NL)
- **Axios** - HTTP client
- **Framer Motion** - Animasyonlar
- **Swiper** - Slider bileşeni
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon seti
- **React Helmet Async** - SEO meta yönetimi
- **SweetAlert2** - Bildirimler
- **QRCode** - 2FA QR kod oluşturma

### Backend
- **.NET 9** - Modern backend framework
- **Entity Framework Core** - ORM
- **AutoMapper** - Object mapping
- **QRCoder** - QR kod oluşturma
- **Swagger** - API dokümantasyonu
- **SQL Server** - Veritabanı

## ✨ Özellikler

### 🎯 Genel Özellikler
- 🌐 **4 Dil Desteği**: Türkçe, İngilizce, Almanca, Hollandaca
- 📱 **Responsive Design**: Tüm cihazlarda mükemmel görünüm
- 🎨 **Modern UI/UX**: Framer Motion ile akıcı animasyonlar
- 🔍 **SEO Optimized**: Dynamic meta tags ve React Helmet
- 🚀 **Performans**: Code splitting ve lazy loading

### 🏨 Tur Yönetimi
- Tur listeleme ve detay sayfaları
- Kategori bazlı filtreleme
- Çoklu görselli tur kartları
- Dinamik fiyatlandırma
- Tur ekstraları (aktiviteler, ulaşım, vb.)
- Günlük itinerary (gezi programı)
- Çoklu dil desteği ile tur açıklamaları

### 👤 Kullanıcı Yönetimi
- Kullanıcı kaydı ve girişi
- Role-based authentication (Admin, User)
- JWT token tabanlı kimlik doğrulama
- **2FA (Two-Factor Authentication)**: TOTP tabanlı çift faktörlü doğrulama
- Profil yönetimi

### 🔐 Admin Paneli
- Dashboard ve istatistikler
- Tur CRUD işlemleri
- Kategori yönetimi
- Kullanıcı yönetimi
- Rezervasyon yönetimi
- Dil yönetimi
- Menü editörü
- Sayfa SEO yönetimi
- Dosya yükleme sistemi
- Ayarlar yönetimi

### 📞 İletişim
- İletişim formu
- Dinamik harita entegrasyonu
- E-posta bildirimleri

### 🎨 UI Bileşenleri
- Custom button components
- Loading states
- Error boundaries
- Toast notifications
- Modal dialogs
- Card layouts
- Sliders ve carousels

## 🛠 Kurulum

### Gereksinimler
- Node.js 18+
- .NET 9 SDK
- SQL Server
- Git

### Frontend Kurulumu

```bash
# Proje dizinine git
cd elite-travel

# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Build (production)
npm run build

# Preview production build
npm run preview
```

Frontend varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

### Backend Kurulumu

```bash
# Backend dizinine git
cd EliteTravel-Backend/EliteTravel.API

# Bağımlılıkları geri yükle
dotnet restore

# Veritabanı migration'larını çalıştır
dotnet ef database update

# Uygulamayı çalıştır
dotnet run
```

Backend varsayılan olarak `https://localhost:5001` adresinde çalışacaktır.

### Veritabanı Yapılandırması

`appsettings.json` dosyasında connection string'i güncelleyin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=EliteTravelDB;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

## 📖 Kullanım

### Development Workflow

1. **Backend'i başlat**:
```bash
cd EliteTravel-Backend/EliteTravel.API
dotnet watch run
```

2. **Frontend'i başlat**:
```bash
cd elite-travel
npm run dev
```

3. **API Dokümantasyonuna eriş**: `https://localhost:5001/swagger`

### Admin Paneli

1. Uygulamaya giriş yap
2. Admin rolü ile `/admin` rotasına eriş
3. Dashboard'dan tüm yönetim işlemlerini gerçekleştir

### 2FA Kurulumu

1. Login olduktan sonra 2FA setup sayfasına git
2. QR kodu authenticator uygulamanızla tara (Google Authenticator, Authy, vb.)
3. Doğrulama kodunu gir
4. Sonraki girişlerde 2FA kodu istenecek

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/login              # Kullanıcı girişi
POST   /api/auth/register           # Kullanıcı kaydı
POST   /api/auth/verify-2fa         # 2FA doğrulama
POST   /api/auth/setup-2fa          # 2FA kurulum
POST   /api/auth/refresh-token      # Token yenileme
```

### Tours
```
GET    /api/tours                   # Tüm turlar
GET    /api/tours/{id}              # Tur detayı
POST   /api/tours                   # Tur oluştur (Admin)
PUT    /api/tours/{id}              # Tur güncelle (Admin)
DELETE /api/tours/{id}              # Tur sil (Admin)
GET    /api/tours/category/{id}     # Kategoriye göre turlar
```

### Categories
```
GET    /api/categories              # Tüm kategoriler
GET    /api/categories/{id}         # Kategori detayı
POST   /api/categories              # Kategori oluştur (Admin)
PUT    /api/categories/{id}         # Kategori güncelle (Admin)
DELETE /api/categories/{id}         # Kategori sil (Admin)
```

### Bookings
```
GET    /api/bookings                # Tüm rezervasyonlar (Admin)
GET    /api/bookings/user/{id}      # Kullanıcı rezervasyonları
POST   /api/bookings                # Rezervasyon oluştur
PUT    /api/bookings/{id}           # Rezervasyon güncelle
DELETE /api/bookings/{id}           # Rezervasyon iptal
```

### Languages
```
GET    /api/languages               # Desteklenen diller
POST   /api/languages               # Dil ekle (Admin)
PUT    /api/languages/{id}          # Dil güncelle (Admin)
DELETE /api/languages/{id}          # Dil sil (Admin)
```

### File Upload
```
POST   /api/fileupload              # Dosya yükle (Admin)
```

### Pages SEO
```
GET    /api/pages-seo               # Sayfa SEO ayarları
PUT    /api/pages-seo/{id}          # SEO güncelle (Admin)
```

## 🌍 Çok Dilli Sistem

Proje i18next kütüphanesi ile çok dilli destek sağlar.

### Desteklenen Diller
- 🇹🇷 Türkçe (tr)
- 🇬🇧 İngilizce (en)
- 🇩🇪 Almanca (de)
- 🇳🇱 Hollandaca (nl)

### Dil Dosyaları
Çeviri dosyaları `elite-travel/public/locales/{lang}/translation.json` konumunda bulunur.

### Kullanım
```jsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
}
```

### Yeni Çeviri Ekleme
`TRANSLATE_GUIDE.md` dosyasına bakın.

## 🔐 Güvenlik

### Kimlik Doğrulama
- JWT (JSON Web Token) tabanlı authentication
- Refresh token mekanizması
- Password hashing (BCrypt)
- Role-based authorization (Admin, User)

### Two-Factor Authentication (2FA)
- TOTP (Time-based One-Time Password) algoritması
- QR kod ile kolay kurulum
- Authenticator app desteği (Google Authenticator, Authy, vb.)
- 30 saniyelik token geçerlilik süresi

### API Güvenliği
- CORS policy
- Request validation
- File upload restrictions
- SQL injection protection (Entity Framework)
- XSS protection

## 📝 Geliştirme Notları

### Code Style
- ESLint ile kod standartları
- Prettier formatting (frontend)
- .NET naming conventions (backend)

### Git Workflow
- `master` - Ana geliştirme branch'i
- `stable` - Production-ready kod
- Feature branches için `feature/` prefix kullan

### Environment Variables

**Frontend** (`.env`):
```env
VITE_API_BASE_URL=https://localhost:5001/api
```

**Backend** (`appsettings.json`):
```json
{
  "JwtSettings": {
    "SecretKey": "YOUR_SECRET_KEY",
    "Issuer": "EliteTravel",
    "Audience": "EliteTravelUsers",
    "ExpiryMinutes": 60
  }
}
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje özel bir projedir.

## 👨‍💻 İletişim

Sorularınız için lütfen iletişime geçin.

---

**Elite Travel** - Modern, Güvenli, Kullanıcı Dostu Tur Yönetim Sistemi 🚀
