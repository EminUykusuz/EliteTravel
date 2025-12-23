using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class CreateTourTranslationDto
    {
        [Required]
        public int TourId { get; set; }

        [Required]
        public int LanguageId { get; set; }

        [Required(ErrorMessage = "Başlık zorunludur")]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [MaxLength(250)]
        public string? Slug { get; set; }

        // JSON alanları - çeviri yönetimi için
        public string? ItinerariesJson { get; set; }
        public string? ExtrasJson { get; set; }
    }
}