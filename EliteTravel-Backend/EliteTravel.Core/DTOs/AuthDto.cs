using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class LoginRequestDto
    {
        [Required(ErrorMessage = "Email alanı zorunludur")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Şifre alanı zorunludur")]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public string? Token { get; set; }
        public UserResponseDto? User { get; set; }
        public bool Requires2FA { get; set; }
        public string? TempToken { get; set; }
        public string? QRCodeUrl { get; set; } // For initial 2FA setup
        public string? Secret { get; set; } // Google Auth Secret for display
        public bool IsFirstTimeSetup { get; set; }
    }

    public class Verify2FARequestDto
    {
        [Required]
        public string Code { get; set; } = string.Empty;

        [Required]
        public string TempToken { get; set; } = string.Empty;
    }

    public class Verify2FAResponseDto
    {
        public string? Token { get; set; }
        public UserResponseDto? User { get; set; }
    }
}
