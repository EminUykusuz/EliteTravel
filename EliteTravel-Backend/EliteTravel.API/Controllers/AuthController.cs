using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Data.Contexts;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponseDto<LoginResponseDto>>> Login([FromBody] LoginRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<LoginResponseDto>.ErrorResponse("Doğrulama başarısız"));

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && !u.IsDeleted);
            if (user == null)
                return Unauthorized(ApiResponseDto<LoginResponseDto>.ErrorResponse("Email veya şifre hatalı"));

            // Şifre kontrolü
            if (!VerifyPassword(dto.Password, user.PasswordHash))
                return Unauthorized(ApiResponseDto<LoginResponseDto>.ErrorResponse("Email veya şifre hatalı"));

            // 👇 DEĞİŞTİ: TwoFAEnabled kontrolü - daha net
            bool isFirstTimeSetup = !user.TwoFAEnabled || string.IsNullOrEmpty(user.TwoFASecret);
            
            if (string.IsNullOrEmpty(user.TwoFASecret))
            {
                var secret = GenerateGoogleAuthSecret();
                user.TwoFASecret = secret;
                await _context.SaveChangesAsync();
            }

            var tempToken = CreateTempToken(user);

            return Ok(ApiResponseDto<LoginResponseDto>.SuccessResponse(
                new LoginResponseDto
                {
                    Requires2FA = true,
                    TempToken = tempToken,
                    IsFirstTimeSetup = isFirstTimeSetup,
                    Secret = user.TwoFASecret,
                    QRCodeUrl = string.Empty,
                    User = new UserResponseDto
                    {
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName
                    }
                },
                "Google Authenticator'a QR kodu tarayın"
            ));
        }

        [HttpPost("verify-2fa")]
        public async Task<ActionResult<ApiResponseDto<LoginResponseDto>>> Verify2FA([FromBody] Verify2FARequestDto dto)
        {
            // Temp token valide et
            var principal = ValidateTempToken(dto.TempToken);
            if (principal == null)
                return Unauthorized(ApiResponseDto<LoginResponseDto>.ErrorResponse("Oturum süresi doldu"));

            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim?.Value, out var userId))
                return Unauthorized(ApiResponseDto<LoginResponseDto>.ErrorResponse("Geçersiz oturum"));

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return Unauthorized(ApiResponseDto<LoginResponseDto>.ErrorResponse("Kullanıcı bulunamadı"));

            // 2FA kodu doğrula
            bool codeValid = false;
            
            if (!string.IsNullOrEmpty(user.TwoFASecret))
            {
                // Google Authenticator kodu (TOTP) doğrula
                codeValid = VerifyGoogleAuthCode(user.TwoFASecret, dto.Code);
                
                // 👇 DEĞİŞTİ: Kod doğruysa ve ilk kurulum ise aktif et
                if (codeValid && !user.TwoFAEnabled)
                {
                    user.TwoFAEnabled = true;
                    user.GoogleAuthEnabled = true;
                    await _context.SaveChangesAsync();
                }
            }
            else
            {
                // Demo: hardcoded code
                codeValid = dto.Code == "123456";
            }

            if (!codeValid)
                return BadRequest(ApiResponseDto<LoginResponseDto>.ErrorResponse("Hatalı kod"));

            // JWT token oluştur
            var token = CreateJwtToken(user);
            var userDto = new UserResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role
            };

            return Ok(ApiResponseDto<LoginResponseDto>.SuccessResponse(
                new LoginResponseDto
                {
                    Token = token,
                    User = userDto,
                    Requires2FA = false,
                    IsFirstTimeSetup = false
                },
                "2FA doğrulanmıştır"
            ));
        }

        private string CreateJwtToken(User user)
        {
            var jwtSecret = _configuration["JwtSettings:Secret"] ?? "your-secret-key-please-change-in-production";
            var jwtExpiryMinutes = int.Parse(_configuration["JwtSettings:ExpiryMinutes"] ?? "1440");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(jwtSecret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                    new Claim("role", user.Role ?? "User")
                }),
                Expires = DateTime.UtcNow.AddMinutes(jwtExpiryMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string CreateTempToken(User user)
        {
            var key = Encoding.ASCII.GetBytes("elite-travel-temp-secret-key-2fa-authentication-token-must-be-at-least-256-bits");
            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(5),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private ClaimsPrincipal? ValidateTempToken(string token)
        {
            try
            {
                var key = Encoding.ASCII.GetBytes("elite-travel-temp-secret-key-2fa-authentication-token-must-be-at-least-256-bits");
                var tokenHandler = new JwtSecurityTokenHandler();

                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return principal;
            }
            catch
            {
                return null;
            }
        }

        private string GenerateGoogleAuthSecret()
        {
            byte[] secretBytes = new byte[32];
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(secretBytes);
            }
            return Base32Encode(secretBytes);
        }

        private string Base32Encode(byte[] input)
        {
            if (input == null || input.Length == 0)
                return string.Empty;

            const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            int buffer = input[0];
            int bufferSize = 8;
            int index = 0;
            var output = new StringBuilder();

            while (bufferSize > 0 || index < input.Length)
            {
                if (bufferSize < 5)
                {
                    if (index < input.Length)
                    {
                        buffer <<= 8;
                        buffer |= input[index++] & 0xff;
                        bufferSize += 8;
                    }
                    else
                    {
                        int pad = 5 - bufferSize;
                        buffer <<= pad;
                        bufferSize += pad;
                    }
                }
                int index5 = (buffer >> (bufferSize - 5)) & 0x1f;
                bufferSize -= 5;
                output.Append(alphabet[index5]);
            }

            return output.ToString();
        }

        private bool VerifyGoogleAuthCode(string secret, string code)
        {
            try
            {
                // TOTP (Time-based One-Time Password) doğrula
                byte[] secretBytes = Base32Decode(secret);
                long timeCounter = DateTimeOffset.UtcNow.ToUnixTimeSeconds() / 30;
                
                // Şu anki ve önceki/sonraki 30 saniyelik pencereleri kontrol et
                for (long i = -1; i <= 1; i++)
                {
                    byte[] counter = BitConverter.GetBytes(timeCounter + i);
                    if (BitConverter.IsLittleEndian)
                        Array.Reverse(counter);

                    using (var hmac = new HMACSHA1(secretBytes))
                    {
                        byte[] hash = hmac.ComputeHash(counter);
                        int offset = hash[hash.Length - 1] & 0xf;
                        int otp = (hash[offset] & 0x7f) << 24 | (hash[offset + 1] & 0xff) << 16 | 
                                  (hash[offset + 2] & 0xff) << 8 | (hash[offset + 3] & 0xff);
                        otp = otp % 1000000;

                        if (otp.ToString("D6") == code)
                            return true;
                    }
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        private byte[] Base32Decode(string input)
        {
            const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            var buffer = new byte[input.Length * 5 / 8];
            int bufferIndex = 0;
            int bufferBits = 0;
            int bufferBitCount = 0;

            foreach (char c in input)
            {
                int index = alphabet.IndexOf(c);
                if (index == -1)
                    throw new ArgumentException($"Invalid character: {c}");

                bufferBits = (bufferBits << 5) | index;
                bufferBitCount += 5;

                if (bufferBitCount >= 8)
                {
                    bufferBitCount -= 8;
                    buffer[bufferIndex++] = (byte)((bufferBits >> bufferBitCount) & 0xff);
                }
            }

            Array.Resize(ref buffer, bufferIndex);
            return buffer;
        }

        private bool VerifyPassword(string password, string hash)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var computedHash = Convert.ToBase64String(hashedBytes);
                return computedHash == hash;
            }
        }
    }
}