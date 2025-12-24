# 📧 Email Sistemi - Kullanım Kılavuzu

## Frontend Değişiklikleri

### ✅ ContactPage.jsx
**Değişiklik:** Email bildirimi eklendi

```jsx
// Success mesajı güncellemesi
{submitStatus === 'success' && (
  <div className="mb-5 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-md">
    <div className="flex items-start gap-3 text-green-800 mb-3">
      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-bold text-sm">{t('contact.successTitle')}</p>
        <p className="text-xs mt-1">{t('contact.successMessage')}</p>
      </div>
    </div>
    <div className="bg-white/60 rounded-lg p-3 border border-green-200">
      <p className="text-xs text-green-900 flex items-start gap-2">
        <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          📧 <strong>Email bildirimi:</strong> Mesajınız email olarak tarafımıza iletilmiştir. 
          En kısa sürede size dönüş yapacağız.
        </span>
      </p>
    </div>
  </div>
)}
```

**Sonuç:** Müşteri mesaj gönderdiğinde email gönderildiği bilgisi gösterilir.

---

### ✅ ContactMessagesPage.jsx (Admin Panel)
**Değişiklik:** Reply fonksiyonunda email bildirimi eklendi

```jsx
const handleReply = async () => {
  try {
    await api.post(`/contacts/${selectedMessage.id}/reply`, {
      replyMessage: replyText
    });
    
    alert('✅ Yanıt başarıyla gönderildi!\n📧 Müşteriye email olarak iletilmiştir.');
    fetchMessages();
  } catch (error) {
    alert('❌ Yanıt gönderilemedi. Lütfen tekrar deneyin.');
  }
};
```

**Sonuç:** Admin yanıt gönderdiğinde müşteriye email gittiği bildirilir.

---

## Backend Değişiklikleri

### ✅ EmailService.cs (YENİ DOSYA)
**Lokasyon:** `EliteTravel-Backend/EliteTravel.Core/Services/EmailService.cs`

**Özellikler:**
- `IEmailService` interface
- 4 dilde email şablonları (TR/EN/DE/NL)
- Elite Travel branding
- HTML email templates
- SMTP configuration

**Metodlar:**
```csharp
Task<bool> SendEmailAsync(string toEmail, string subject, string body, string? language = "tr")
Task<bool> SendContactNotificationAsync(string customerName, string customerEmail, string message, string language = "tr")
Task<bool> SendContactReplyAsync(string toEmail, string customerName, string replyMessage, string language = "tr")
```

---

### ✅ EliteTravel.Core.csproj
**Ekleme:** NuGet paketi

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.Configuration.Abstractions" Version="9.0.0" />
</ItemGroup>
```

---

### ✅ Program.cs
**Ekleme:** EmailService DI kaydı

```csharp
builder.Services.AddScoped<IEmailService, EmailService>();
```

---

### ✅ ContactsController.cs
**Güncelleme:** Email gönderimi eklendi

```csharp
// Create metodunda
_ = Task.Run(async () =>
{
    try
    {
        await _emailService.SendContactNotificationAsync(
            $"{contact.FirstName} {contact.LastName}",
            contact.Email,
            contact.Message,
            "tr"
        );
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Email sending failed: {ex.Message}");
    }
});

// Reply metodunda
_ = Task.Run(async () =>
{
    try
    {
        await _emailService.SendContactReplyAsync(
            contact.Email,
            $"{contact.FirstName} {contact.LastName}",
            request.ReplyMessage,
            "tr"
        );
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Email sending failed: {ex.Message}");
    }
});
```

---

## Konfigürasyon

### appsettings.local.json
```json
{
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "SmtpUsername": "your-email@gmail.com",
    "SmtpPassword": "your-app-password",
    "FromEmail": "your-email@gmail.com",
    "FromName": "Elite Travel",
    "AdminEmail": "admin@example.com"
  }
}
```

---

## Test Senaryoları

### 1️⃣ Yeni Mesaj Testi
1. Frontend'den contact formu doldur
2. Submit butonuna tıkla
3. ✅ Success mesajında email bildirimi görülmeli
4. 📧 Admin email'e bildirim gitmeli

### 2️⃣ Yanıt Testi
1. Admin panele giriş yap
2. Contact Messages sayfasına git
3. Bir mesaja yanıt yaz
4. Send butonuna tıkla
5. ✅ "Email olarak iletilmiştir" alert'i görülmeli
6. 📧 Müşteri email'ine yanıt gitmeli

### 3️⃣ Çoklu Dil Testi
Backend'de language parametresini değiştirerek test et:
- `"tr"` → Türkçe email
- `"en"` → İngilizce email
- `"de"` → Almanca email
- `"nl"` → Hollandaca email

---

## Email Şablon Özellikleri

### Admin Bildirimi (Yeni Mesaj)
**Konu:** Yeni İletişim Formu Mesajı - Elite Travel

**İçerik:**
- Elite Travel logo
- Müşteri adı
- Email adresi
- Telefon (varsa)
- Mesaj içeriği
- Footer (iletişim bilgileri)

### Müşteri Yanıtı
**Konu:** Mesajınıza Yanıt - Elite Travel

**İçerik:**
- Elite Travel logo
- Müşteri ismine hitap
- Admin yanıtı
- Teşekkür mesajı
- Footer (iletişim bilgileri)

---

## Özellikler

✅ **Non-blocking:** Email gönderimi async, form submit engellemez
✅ **Error handling:** Email hatası form işlemini etkilemez
✅ **Multi-language:** 4 dilde destek
✅ **Branded:** Elite Travel tasarımı (#163a58, #dca725)
✅ **Responsive:** Email template'leri mobil uyumlu
✅ **Professional:** HTML email with CSS styling

---

## Sorun Giderme

### Email Gönderilmiyor
1. Console loglarını kontrol et
2. SMTP credentials doğru mu?
3. Gmail için App Password oluşturuldu mu?
4. Port 587 açık mı?

### Success Mesajı Görünmüyor
1. Browser console'a bak
2. API response 200 OK mi?
3. `submitStatus` state güncellenmiş mi?

### Admin Alert Çıkmıyor
1. Backend çalışıyor mu?
2. Email servisi DI'a kayıtlı mı?
3. Console'da hata var mı?

---

## Dokümantasyon

📚 Detaylı setup için:
- [SMTP_SETUP_GUIDE.md](SMTP_SETUP_GUIDE.md)
- [EMAIL_SYSTEM.md](EMAIL_SYSTEM.md)
- [SECURITY.md](SECURITY.md)

---

**✨ Hazırladı:** Elite Travel Development Team
**📅 Tarih:** 24 Aralık 2024
