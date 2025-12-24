# 🔒 Güvenlik Notları

## Hassas Bilgiler

Bu dosyalar GİT'e **ASLA** eklenMEMELİ:

### Backend
- `appsettings.local.json` - Gerçek connection string ve JWT secret içerir
- `appsettings.Production.json` - Production ayarları

### Frontend  
- `.env.local` - API URL ve diğer environment variables

## Kurulum Sonrası

1. **appsettings.local.json oluştur**:
```json
{
  "ConnectionStrings": {
    "SqlConnection": "GERÇEK_CONNECTION_STRING"
  },
  "JwtSettings": {
    "Secret": "GERÇEK_JWT_SECRET_KEY",
    "ExpiryMinutes": 1440
  },
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

2. **JWT Secret Key Oluşturma**:
```bash
# PowerShell ile güvenli key oluştur
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

3. **Production'da Environment Variables Kullan**:
   - Azure: App Configuration / Key Vault
   - AWS: Secrets Manager
   - Docker: Environment variables

4. **Email Ayarları (Gmail için)**:
   - Gmail hesabınızdan "App Password" oluşturun
   - 2FA etkinleştirin
   - Güvenlik > App Passwords > Yeni uygulama şifresi oluştur
   - Bu şifreyi `SmtpPassword` olarak kullanın

## 📧 Email Sistemi

Proje 4 dilde email gönderebilir (TR, EN, DE, NL):

### Özellikler:
- ✉️ Yeni mesaj geldiğinde admin'e bildirim
- 📬 Admin yanıt verdiğinde müşteriye email
- 🌍 Çok dilli email template'leri
- 🎨 Profesyonel HTML email tasarımı

### Email Template'leri:
1. **Contact Notification** - Yeni mesaj admin'e bildirim
2. **Contact Reply** - Müşteriye yanıt

### Test:
```bash
# SMTP ayarlarını test et
# Gmail için: smtp.gmail.com:587
# Outlook için: smtp.office365.com:587
```

## ⚠️ Önemli
Repository'ye push edilmiş hassas bilgiler varsa:
1. Hemen secret'ları değiştirin
2. Git history'sinden temizleyin (`git filter-branch` veya BFG)
3. Force push yapın
