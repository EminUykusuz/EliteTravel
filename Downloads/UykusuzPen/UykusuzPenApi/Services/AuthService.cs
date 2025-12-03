using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UykusuzPenApi.DTOs;
using UykusuzPenApi.Services.Interfaces;
namespace UykusuzPenApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;

        public AuthService(IConfiguration config)
        {
            _config = config;
        }

        public Task<LoginResponseDto?> LoginAsync(LoginDto dto)
        {
            // sabit kullanıcı + şifre (appsettings.json'tan)
            var sabitKullaniciAdi = _config["DashboardAuth:KullaniciAdi"];
            var sabitSifre = _config["DashboardAuth:Sifre"];

            if (dto.KullaniciAdi != sabitKullaniciAdi || dto.Sifre != sabitSifre)
                return Task.FromResult<LoginResponseDto?>(null);

            var token = GenerateJwtToken();

            var result = new LoginResponseDto
            {
                Token = token,
                Kullanici = new KullaniciDto
                {
                    KullaniciAdi = sabitKullaniciAdi,
                    AdSoyad = "Dashboard Admin"
                }
            };

            return Task.FromResult<LoginResponseDto?>(result);
        }

        // kullanıcı tablosu yok artık, GetUserById boş dönebilir veya kaldırabilirsin
        public Task<KullaniciDto?> GetUserByIdAsync(int id)
        {
            return Task.FromResult<KullaniciDto?>(null);
        }

        private string GenerateJwtToken()
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is missing"));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, _config["DashboardAuth:KullaniciAdi"] ?? "admin")
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
