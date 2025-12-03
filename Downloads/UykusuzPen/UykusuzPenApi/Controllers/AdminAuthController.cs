using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UykusuzPenApi.Data;
using UykusuzPenApi.DTOs;
using UykusuzPenApi.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class AdminAuthController : ControllerBase
{
    private readonly UykusuzPenDbContext _context;
    private readonly IConfiguration _config;
    private readonly IMemoryCache _cache;
    private readonly ILogger<AdminAuthController> _logger;

    // ... (Sabitlerin aynı kalıyor)
    private const int MaxFailedAttempts = 5;
    private static readonly TimeSpan LockoutDuration = TimeSpan.FromMinutes(15);
    private const int MaxAttemptsPerIp = 20;
    private static readonly TimeSpan IpWindow = TimeSpan.FromMinutes(15);

    public AdminAuthController(UykusuzPenDbContext context, IConfiguration config, IMemoryCache cache, ILogger<AdminAuthController> logger)
    {
        _context = context;
        _config = config;
        _cache = cache;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AdminLoginDto dto)
    {
        // ... (Tüm güvenlik, IP ve kullanıcı kontrollerin aynı kalıyor)
        // ... (Bu kodlar çok sağlam, dokunmuyoruz)
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var ipKey = $"login_ip_{ip}";
        var ipCount = _cache.GetOrCreate<int>(ipKey, entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = IpWindow;
            return 0;
        });
        if (ipCount >= MaxAttemptsPerIp)
        {
            _logger.LogWarning("IP rate limit exceeded for {ip}", ip);
            return StatusCode(429, new { success = false, message = "Çok fazla deneme. Bir süre sonra tekrar deneyin." });
        }
        var admin = await _context.AdminUsers.FirstOrDefaultAsync(a => a.UserName == dto.UserName);
        if (admin == null)
        {
            _cache.Set(ipKey, ipCount + 1, IpWindow);
            return Unauthorized(new { success = false, message = "Kullanıcı adı veya şifre hatalı" });
        }
        if (admin.LockoutEnd.HasValue && admin.LockoutEnd.Value > DateTime.UtcNow)
        {
            var remaining = admin.LockoutEnd.Value - DateTime.UtcNow;
            return Unauthorized(new { success = false, message = $"Hesap kilitli. {remaining.Minutes} dakika sonra tekrar deneyin." });
        }
        bool verified = BCrypt.Net.BCrypt.Verify(dto.Password, admin.Password);
        if (!verified)
        {
            admin.FailedLoginCount += 1;
            if (admin.FailedLoginCount >= MaxFailedAttempts)
            {
                admin.LockoutEnd = DateTime.UtcNow.Add(LockoutDuration);
                admin.FailedLoginCount = 0;
                _logger.LogWarning("Account locked out for {user}", admin.UserName);
          }
            _context.Update(admin);
            await _context.SaveChangesAsync();
            _cache.Set(ipKey, ipCount + 1, IpWindow);
             return Unauthorized(new { success = false, message = "Kullanıcı adı veya şifre hatalı" });
        }
        admin.FailedLoginCount = 0;
        admin.LockoutEnd = null;
        _context.Update(admin);
        await _context.SaveChangesAsync();
        _cache.Set(ipKey, 0, IpWindow); 
        var token = GenerateJwtToken(admin);
      
        // Token'ı HttpOnly cookie'ye bas
        var expiryMinutes = int.Parse(_config["JwtSettings:ExpiryMinutes"] ?? "60");
        Response.Cookies.Append("adminToken", token, new CookieOptions
        {
            HttpOnly = true, 
            Secure = true, // 'SameSite.None' için 'true' olmak ZORUNDA
            
            // --- 401 HATASINI ÇÖZECEK DEĞİŞİKLİK ---
            SameSite = SameSiteMode.None, // 'Strict' idi. 'None' yaptık.
            // ----------------------------------------

            Expires = DateTime.UtcNow.AddMinutes(expiryMinutes)
        });

        return Ok(new { success = true, message = "Giriş başarılı" }); 
    }

    // --- YETKİ KONTROLÜ (Aynen Kalıyor) ---
    [Authorize(Roles = "Admin")]
    [HttpGet("check")]
    public IActionResult CheckAuth()
    {
        var userName = User.Identity?.Name ?? "Admin";
        return Ok(new { success = true, message = "Yetkili kullanıcı.", user = userName });
    }
    // ------------------------------------

    // --- GÜVENLİ ÇIKIŞ YAPMA (Burayı da 'None' olarak güncelle) ---
    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("adminToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // 'SameSite.None' için 'true' olmak ZORUNDA
            
            // --- 401 HATASINI ÇÖZECEK DEĞİŞİKLİK ---
            SameSite = SameSiteMode.None // 'Strict' idi. 'None' yaptık.
            // ----------------------------------------
        });
        return Ok(new { success = true, message = "Çıkış başarılı" });
    }
    // -----------------------------------------------------------

    // --- TOKEN OLUŞTURUCU (Aynen Kalıyor) ---
    private string GenerateJwtToken(AdminUser admin)
    {
        var keyStr = _config["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(keyStr))
            throw new InvalidOperationException("JWT Key is not configured.");

        var key = Encoding.UTF8.GetBytes(keyStr);
        var tokenHandler = new JwtSecurityTokenHandler();

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
            new Claim(ClaimTypes.Name, admin.UserName),
            new Claim(ClaimTypes.Role, "Admin")
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(int.Parse(_config["JwtSettings:ExpiryMinutes"] ?? "60")),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _config["JwtSettings:Issuer"],
            Audience = _config["JwtSettings:Audience"]
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

