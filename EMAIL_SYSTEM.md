# 📧 Elite Travel - Email System

## Özellikler

✅ 4 Dil Desteği (TR, EN, DE, NL)
✅ Profesyonel HTML Email Template'leri
✅ Otomatik Admin Bildirimleri
✅ Müşteri Yanıt Sistemi
✅ Async Email Gönderimi (Performance)

## Email Tipleri

### 1. Contact Notification (Yeni Mesaj)
Müşteri contact formunu doldurduğunda admin'e gönderilir.

**İçerik:**
- Müşteri adı ve email
- Mesaj içeriği
- Otomatik tarih/saat

### 2. Contact Reply (Yanıt)
Admin mesaja yanıt verdiğinde müşteriye gönderilir.

**İçerik:**
- Kişiselleştirilmiş selamlama
- Admin'in yanıt mesajı
- İletişim bilgileri

## Kurulum

### 1. SMTP Ayarları

`appsettings.local.json` dosyasını oluştur:

```json
{
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "SmtpUsername": "your-email@gmail.com",
    "SmtpPassword": "your-app-password",
    "FromEmail": "noreply@elitetravel.com",
    "FromName": "Elite Travel",
    "AdminEmail": "admin@elitetravel.com"
  }
}
```

### 2. Gmail için App Password Oluşturma

1. Google Account > Security
2. 2-Step Verification etkinleştir
3. App Passwords > Select app: Mail
4. Generate
5. Oluşan 16 haneli şifreyi kopyala
6. `SmtpPassword` olarak kullan

### 3. Diğer Email Sağlayıcıları

#### Outlook/Office365
```json
{
  "SmtpHost": "smtp.office365.com",
  "SmtpPort": "587"
}
```

#### SendGrid
```json
{
  "SmtpHost": "smtp.sendgrid.net",
  "SmtpPort": "587",
  "SmtpUsername": "apikey",
  "SmtpPassword": "YOUR_SENDGRID_API_KEY"
}
```

#### AWS SES
```json
{
  "SmtpHost": "email-smtp.us-east-1.amazonaws.com",
  "SmtpPort": "587",
  "SmtpUsername": "YOUR_SMTP_USERNAME",
  "SmtpPassword": "YOUR_SMTP_PASSWORD"
}
```

## Kullanım

### Backend'de Email Gönderme

```csharp
// Injection
public class ContactsController : ControllerBase
{
    private readonly IEmailService _emailService;
    
    public ContactsController(IEmailService emailService)
    {
        _emailService = emailService;
    }
    
    // Yeni mesaj geldiğinde
    await _emailService.SendContactNotificationAsync(
        customerName: "John Doe",
        customerEmail: "john@example.com",
        message: "Merhaba, tur hakkında bilgi almak istiyorum",
        language: "tr"
    );
    
    // Yanıt verirken
    await _emailService.SendContactReplyAsync(
        toEmail: "john@example.com",
        customerName: "John Doe",
        replyMessage: "Merhaba John, turlarımız hakkında...",
        language: "tr"
    );
}
```

### Custom Email Gönderme

```csharp
await _emailService.SendEmailAsync(
    toEmail: "customer@example.com",
    subject: "Custom Subject",
    body: "<h1>Custom HTML Content</h1>",
    language: "en"
);
```

## Email Template'leri

### Çok Dilli Destek

Email başlıkları ve içerikleri otomatik olarak dile göre değişir:

| Dil | Kod | Örnek Başlık |
|-----|-----|--------------|
| 🇹🇷 Türkçe | `tr` | "Yeni İletişim Formu Mesajı" |
| 🇬🇧 İngilizce | `en` | "New Contact Form Submission" |
| 🇩🇪 Almanca | `de` | "Neue Kontaktformular-Einreichung" |
| 🇳🇱 Hollandaca | `nl` | "Nieuwe contactformulier inzending" |

### Template Yapısı

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Elite Travel brand colors */
        .header { background: linear-gradient(135deg, #163a58 0%, #1e4a6a 100%); }
        .highlight { color: #dca725; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🌍 Elite Travel</h1>
        </div>
        <div class='content'>
            <!-- Dynamic content -->
        </div>
        <div class='footer'>
            <!-- Contact info -->
        </div>
    </div>
</body>
</html>
```

## Test

### Test Email Gönderimi

```bash
# Backend'i başlat
cd EliteTravel-Backend/EliteTravel.API
dotnet run

# Frontend'den test
# Contact formunu doldur ve gönder
```

### Email Doğrulama

1. Spam klasörünü kontrol et
2. SMTP ayarlarını doğrula
3. Firewall/Port erişimini kontrol et (Port 587)
4. Console loglarını kontrol et

## Sorun Giderme

### Email Gönderilmiyor

1. **SMTP Ayarları Yanlış**
   - Host, port, username, password kontrol et
   - Gmail için App Password kullanıldığından emin ol

2. **Port Blocked**
   - Port 587 açık mı kontrol et
   - Alternative olarak port 465 (SSL) dene

3. **Gmail "Less Secure Apps"**
   - App Password kullan (önerilen)
   - Veya "Less secure app access" etkinleştir

4. **Rate Limiting**
   - Gmail: 500 email/gün
   - Office365: 10000 email/gün
   - SendGrid/SES: Limitsiz (ücretli)

### Console'da Error Logları

```bash
Email sending failed: [hata mesajı]
Email notification failed: [hata mesajı]
Reply email failed: [hata mesajı]
```

## Production Önerileri

### 1. Professional Email Service Kullan
- ✅ SendGrid (99€/ay - 100k email)
- ✅ AWS SES (0.10$ / 1000 email)
- ✅ Mailgun
- ❌ Gmail (production için uygun değil)

### 2. Email Queue Sistemi
```csharp
// Background service ile email kuyruğu
services.AddHostedService<EmailQueueService>();
```

### 3. Email Tracking
- Açılma oranları
- Click tracking
- Bounce handling

### 4. Email Validation
```csharp
// Email doğrulama servisi
var isValid = await EmailValidator.ValidateAsync(email);
```

## Güvenlik

- ⚠️ SMTP credentials'ı **asla** Git'e pushlamayın
- ✅ `appsettings.local.json` kullanın
- ✅ Environment variables kullanın (Production)
- ✅ Rate limiting uygulayın
- ✅ Email validation yapın

## Lisans

Bu email sistemi Elite Travel projesi için özel olarak geliştirilmiştir.

---

**Elite Travel** - Modern Email System 📧
