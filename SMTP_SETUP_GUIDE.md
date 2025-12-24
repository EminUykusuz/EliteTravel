# 📧 Elite Travel - SMTP Kurulum Rehberi

## Gmail ile SMTP Kurulumu

### Adım 1: Google Hesabınızı Hazırlayın

1. Gmail hesabınıza giriş yapın
2. [Google Account Security](https://myaccount.google.com/security) sayfasına gidin

### Adım 2: 2-Step Verification Aktif Edin

1. "2-Step Verification" bölümüne tıklayın
2. "Get Started" butonuna tıklayın
3. Telefon numaranızı ekleyin
4. SMS veya Google Authenticator ile doğrulayın
5. "Turn On" butonuna tıklayın

### Adım 3: App Password Oluşturun

1. [App Passwords](https://myaccount.google.com/apppasswords) sayfasına gidin
2. "Select app" dropdown'ından **Mail** seçin
3. "Select device" dropdown'ından **Other (Custom name)** seçin
4. "Elite Travel SMTP" yazın
5. **Generate** butonuna tıklayın
6. 16 haneli şifreyi kopyalayın (örn: `abcd efgh ijkl mnop`)

### Adım 4: appsettings.local.json Dosyasını Güncelleyin

```json
{
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "SmtpUsername": "sizin-email@gmail.com",
    "SmtpPassword": "abcd efgh ijkl mnop",  // ← Kopyaladığınız 16 haneli şifre (boşluksuz)
    "FromEmail": "sizin-email@gmail.com",
    "FromName": "Elite Travel",
    "AdminEmail": "admin-email@gmail.com"  // ← Bildirimleri alacak email
  }
}
```

⚠️ **ÖNEMLİ:** Şifreyi boşluksuz yazın: `abcdefghijklmnop`

### Adım 5: Test Edin

```bash
# Backend'i başlat
cd EliteTravel-Backend/EliteTravel.API
dotnet run

# Frontend'den contact form gönderin
# Admin email'e bildirim gitmeli
```

---

## Outlook/Office365 ile SMTP Kurulumu

### Adım 1: App Password Oluşturun

1. [Microsoft Account Security](https://account.microsoft.com/security) sayfasına gidin
2. "Advanced security options" tıklayın
3. "App passwords" bölümünde "Create a new app password" tıklayın
4. Oluşan şifreyi kopyalayın

### Adım 2: appsettings.local.json Güncelleyin

```json
{
  "EmailSettings": {
    "SmtpHost": "smtp.office365.com",
    "SmtpPort": "587",
    "SmtpUsername": "sizin-email@outlook.com",
    "SmtpPassword": "app-password-buraya",
    "FromEmail": "sizin-email@outlook.com",
    "FromName": "Elite Travel",
    "AdminEmail": "admin@outlook.com"
  }
}
```

---

## SendGrid ile SMTP Kurulumu (Önerilen - Production)

### Avantajları:
- ✅ Günde 100 email ücretsiz
- ✅ Email tracking ve analytics
- ✅ Yüksek delivery rate
- ✅ Professional

### Adım 1: SendGrid Hesabı Oluşturun

1. [SendGrid](https://signup.sendgrid.com/) kaydolun
2. Email'inizi doğrulayın

### Adım 2: API Key Oluşturun

1. [API Keys](https://app.sendgrid.com/settings/api_keys) sayfasına gidin
2. "Create API Key" tıklayın
3. İsim verin: "Elite Travel SMTP"
4. "Full Access" seçin
5. "Create & View" tıklayın
6. API Key'i kopyalayın (bir daha gösterilmeyecek!)

### Adım 3: appsettings.local.json Güncelleyin

```json
{
  "EmailSettings": {
    "SmtpHost": "smtp.sendgrid.net",
    "SmtpPort": "587",
    "SmtpUsername": "apikey",  // ← Kelimenin kendisi "apikey"
    "SmtpPassword": "SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",  // ← API Key buraya
    "FromEmail": "noreply@elitetravel.com",
    "FromName": "Elite Travel",
    "AdminEmail": "admin@elitetravel.com"
  }
}
```

### Adım 4: Sender Authentication (Opsiyonel ama Önerilen)

1. [Sender Authentication](https://app.sendgrid.com/settings/sender_auth) sayfasına gidin
2. Domain'inizi doğrulayın veya Single Sender Verification yapın
3. Bu, email'lerin spam'e düşmesini engeller

---

## AWS SES ile SMTP Kurulumu (Production - Büyük Ölçek)

### Avantajları:
- ✅ Çok ucuz (1000 email = $0.10)
- ✅ Sınırsız gönderim
- ✅ AWS ekosistemi entegrasyonu

### Adım 1: AWS SES Hesabı

1. [AWS Console](https://console.aws.amazon.com/ses/) giriş yapın
2. Region seçin (örn: us-east-1)
3. Email Addresses > Verify a New Email Address
4. Email'inizi doğrulayın

### Adım 2: SMTP Credentials Oluşturun

1. "SMTP Settings" sayfasına gidin
2. "Create My SMTP Credentials" tıklayın
3. Username ve Password'ü indirin (bir daha gösterilmez!)

### Adım 3: Production Access İsteyin

⚠️ AWS SES başta "sandbox mode"da (günde 200 email limiti)
1. "Request Production Access" tıklayın
2. Use case açıklayın
3. 24 saat içinde onaylanır

### Adım 4: appsettings.local.json Güncelleyin

```json
{
  "EmailSettings": {
    "SmtpHost": "email-smtp.us-east-1.amazonaws.com",
    "SmtpPort": "587",
    "SmtpUsername": "AKIAIOSFODNN7EXAMPLE",
    "SmtpPassword": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    "FromEmail": "noreply@elitetravel.com",
    "FromName": "Elite Travel",
    "AdminEmail": "admin@elitetravel.com"
  }
}
```

---

## Test Etme

### Console'da Log Kontrolü

```bash
# Backend çalışırken console'da göreceksiniz:
Email sending failed: [hata mesajı]  # ← Hata varsa
Email sent successfully               # ← Başarılıysa (ekleyin kod'a)
```

### Test Email Gönderme

1. Frontend'i başlatın
2. Contact formunu doldurun
3. Gönder butonuna tıklayın
4. Admin email'e bildirim gelmeli
5. Admin panelden yanıt verin
6. Müşteri email'e yanıt gitmeli

### Spam Klasörünü Kontrol Edin

İlk email'ler spam'e düşebilir:
- Gmail'de "Not spam" işaretleyin
- SendGrid/SES kullanıyorsanız domain doğrulaması yapın

---

## Sorun Giderme

### 1. "Authentication failed" Hatası

**Çözüm:**
- Gmail için App Password kullandığınızdan emin olun
- Normal şifre **çalışmaz**!
- 2-Step Verification aktif olmalı

### 2. "Unable to connect to SMTP server" Hatası

**Çözüm:**
- Port 587 açık mı kontrol edin
- Firewall/antivirus engelliyor olabilir
- `SmtpHost` doğru mu kontrol edin

### 3. "Mailbox unavailable" Hatası

**Çözüm:**
- `FromEmail` doğrulanmış bir email olmalı
- SendGrid/SES'te sender verification yapın

### 4. Email Gönderilmiyor ama Hata Yok

**Çözüm:**
- Console loglarını kontrol edin
- Email async gönderiliyor, hata sessiz olabilir
- `try-catch` bloğuna log ekleyin

### 5. Email Spam'e Düşüyor

**Çözüm:**
- SPF/DKIM/DMARC kayıtları ekleyin (domain'de)
- SendGrid/SES sender authentication yapın
- "Not spam" olarak işaretleyin

---

## Production Deployment

### 1. Environment Variables Kullanın

Azure App Service:
```bash
az webapp config appsettings set --name elite-travel \
  --settings EmailSettings__SmtpPassword="your-password"
```

Docker:
```yaml
environment:
  - EmailSettings__SmtpHost=smtp.sendgrid.net
  - EmailSettings__SmtpPassword=${SMTP_PASSWORD}
```

### 2. Secret Manager

```bash
# User secrets ekle
dotnet user-secrets set "EmailSettings:SmtpPassword" "your-password"
```

### 3. Monitoring

Email gönderim başarısını logla:
```csharp
if (await _emailService.SendEmailAsync(...))
{
    _logger.LogInformation("Email sent successfully to {Email}", toEmail);
}
else
{
    _logger.LogError("Email failed to send to {Email}", toEmail);
}
```

---

## Güvenlik Kontrol Listesi

- [ ] `appsettings.local.json` `.gitignore`'da
- [ ] SMTP credentials asla Git'e pushlanmadı
- [ ] Production'da environment variables kullanılıyor
- [ ] 2FA/App Password kullanılıyor (Gmail)
- [ ] Rate limiting aktif (günde max X email)
- [ ] Email validation yapılıyor
- [ ] SPF/DKIM kayıtları eklendi (production)

---

## Email Örnekleri

### Yeni Mesaj Bildirimi (Admin'e)

```
Konu: Yeni İletişim Formu Mesajı - Elite Travel

[Elite Travel Logo]

✨ Yeni İletişim Formu Mesajı

👤 Müşteri: John Doe
📧 Email: john@example.com

💬 Mesaj:
Merhaba, İstanbul turları hakkında bilgi almak istiyorum...

---
Elite Travel - Premium Tourism Experience
📧 info@elitetravel.com | 📞 +31 6 21525757
```

### Yanıt Email'i (Müşteriye)

```
Konu: Mesajınıza Yanıt - Elite Travel

[Elite Travel Logo]

Sayın John Doe,

Elite Travel ile iletişime geçtiğiniz için teşekkür ederiz. 
Mesajınızı aldık ve yanıtımız aşağıdadır:

Merhaba John, İstanbul turlarımız hakkında...

Saygılarımızla,
Elite Travel Team

---
Elite Travel - Premium Tourism Experience
📧 info@elitetravel.com | 📞 +31 6 21525757
```

---

## Yararlı Linkler

- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [AWS SES SMTP Guide](https://docs.aws.amazon.com/ses/latest/dg/smtp-connect.html)
- [Email Testing Tool](https://www.mail-tester.com/)

---

**Hazırladı:** Elite Travel Development Team
**Tarih:** Aralık 2025
