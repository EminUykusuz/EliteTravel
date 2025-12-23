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

## ⚠️ Önemli
Repository'ye push edilmiş hassas bilgiler varsa:
1. Hemen secret'ları değiştirin
2. Git history'sinden temizleyin (`git filter-branch` veya BFG)
3. Force push yapın
