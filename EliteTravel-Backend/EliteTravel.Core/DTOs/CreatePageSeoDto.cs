using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class CreatePageSeoDto
    {
        [Required(ErrorMessage = "Sayfa anahtarı zorunludur")]
        [MaxLength(100)]
        public string PageKey { get; set; } = string.Empty;

        [Required(ErrorMessage = "Başlık zorunludur")]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(500)]
        public string? Keywords { get; set; }

        public string? OgImage { get; set; }
    }
}