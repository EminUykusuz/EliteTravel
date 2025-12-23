using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class CreateContactDto
    {
        [Required(ErrorMessage = "Ad alanı zorunludur")]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Soyad alanı zorunludur")]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email alanı zorunludur")]
        [EmailAddress(ErrorMessage = "Geçerli bir email adresi giriniz")]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Geçerli bir telefon numarası giriniz")]
        [MaxLength(20)]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Mesaj alanı zorunludur")]
        [MinLength(10, ErrorMessage = "Mesaj en az 10 karakter olmalıdır")]
        public string Message { get; set; } = string.Empty;

        [Required(ErrorMessage = "reCAPTCHA token zorunludur")]
        public string RecaptchaToken { get; set; } = string.Empty;
    }
}