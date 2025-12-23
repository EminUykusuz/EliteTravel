# 🌍 Translate Sistemi - Kullanım Rehberi

## Kurulum Tamamlandı ✅

i18next ve react-i18next kütüphaneleri yüklendi.

## 📁 Dosya Yapısı

```
public/
└── locales/
    ├── tr/
    │   └── common.json (Türkçe çeviriler)
    └── en/
        └── common.json (İngilizce çeviriler)

src/
├── i18n/
│   └── config.js (i18n konfigürasyonu)
└── components/
    └── ui/
        └── LanguageSwitcher.jsx (Dil seçici component)
```

## 🚀 Nasıl Kullanılır?

### 1. Component'e Import Ekle

```jsx
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('hero.title')}</h1>;
}
```

### 2. JSON'da Çevirileri Ekle

**public/locales/tr/common.json:**
```json
{
  "benimsektionadi": {
    "baslik": "Bu bir başlık",
    "paragraF": "Bu bir paragraf"
  }
}
```

**public/locales/en/common.json:**
```json
{
  "benimsektionadi": {
    "baslik": "This is a title",
    "paragraF": "This is a paragraph"
  }
}
```

### 3. Component'te Kullan

```jsx
{t('benimsektionadi.baslik')}
{t('benimsektionadi.paragraF')}
```

## 🎯 Mevcut Çeviriler

- ✅ Navigation (nav)
- ✅ Hero Section (hero)
- ✅ Tours (tours)
- ✅ About Us (aboutUs)
- ✅ Contact (contact)
- ✅ Footer (footer)
- ✅ Common (common)

## 💡 İpuçları

### Değişken Kullanma

JSON:
```json
{
  "selamla": "Merhaba {{name}}!"
}
```

Component:
```jsx
{t('selamla', { name: 'Ali' })}
// Çıktı: "Merhaba Ali!"
```

### Plural Formlar

JSON:
```json
{
  "kitap": "{{count}} kitap",
  "kitap_one": "{{count}} kitap",
  "kitap_other": "{{count}} kitap"
}
```

### Nested Namespaces

JSON'da:
```json
{
  "pages": {
    "home": {
      "title": "Ana Sayfa"
    }
  }
}
```

Component'te:
```jsx
{t('pages.home.title')}
```

## 🔄 Dil Değiştirme

Navbar'da otomatik olarak dil seçici bulunuyor. Kullanıcı seçimi localStorage'da kaydediliyor.

## 📝 YENİ ÇEVIRI EKLEME ADIMLARI

1. **JSON dosyalarını aç:**
   - `public/locales/tr/common.json`
   - `public/locales/en/common.json`

2. **Aynı yapı ile ekle:**
   ```json
   "yeniBolum": {
     "key": "Türkçe metin"
   }
   ```

3. **Component'te kullan:**
   ```jsx
   const { t } = useTranslation();
   return <div>{t('yeniBolum.key')}</div>;
   ```

## ⚙️ Konfigürasyon

**src/i18n/config.js** dosyasında ayarlanabilir:
- Varsayılan dil: `fallbackLng: 'en'`
- Desteklenen diller
- Cache ayarları

## 🌐 Dil Değiştirme Nerede?

- **Navbar:** Sağ üst köşede Globe ikonu
- **Responsive:** Mobilde footer'da

## 🎨 LanguageSwitcher Özelleştirme

`src/components/ui/LanguageSwitcher.jsx` dosyasında:
- Dil isimleri
- Bayraklar (Emoji)
- Stillendirme

## 🔧 Troubleshooting

### Çeviriler yüklenmiyor?
- `public/locales/` klasör yapısını kontrol et
- Browser console'da hata var mı kontrol et
- `npm run dev` ile yeniden başlat

### Dil değişimi çalışmıyor?
- localStorage ayarlarını temizle (F12 > Application > Storage)
- `i18n/config.js`'de `debug: true` yap
- i18n hook'ını doğru import ettin mi kontrol et

## 📦 Sonraki Adımlar

1. Tüm component'leri translate et
2. Backend'den dinamik çeviriler al (opsiyonel)
3. RTL (Sağdan Sola) destek ekle (opsiyonel)
4. SEO friendly meta tags ekle her dil için

---

**Hızlı Komut:**
```bash
# Yeni kütüphane eklemek gerekirse:
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
```
