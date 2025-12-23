using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class CreateTourDto
    {
        [Required(ErrorMessage = "Başlık alanı zorunludur")]
        [MaxLength(200)]
        public string Title { get; set; }

        [MaxLength(200)]
        public string? Slug { get; set; }

        [Required(ErrorMessage = "Fiyat alanı zorunludur")]
        [Range(0, double.MaxValue, ErrorMessage = "Fiyat 0 dan büyük olmalıdır")]
        public decimal Price { get; set; }

        [MaxLength(10)]
        public string? Currency { get; set; } = "TRY";

        [Required(ErrorMessage = "Kapasite alanı zorunludur")]
        [Range(1, 1000, ErrorMessage = "Kapasite 1 ile 1000 arasında olmalıdır")]
        public int Capacity { get; set; }

        public string? MainImage { get; set; }
        public string? Thumbnail { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public int? GuideId { get; set; }
        
        public List<int>? CategoryIds { get; set; }
        public List<TourTranslationDto>? Translations { get; set; }
        public List<ItineraryDto>? Itineraries { get; set; }
        public List<TourExtraDto>? Extras { get; set; }
    }

    public class TourTranslationDto
    {
        public int LanguageId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Slug { get; set; }
        
        // JSON alanları
        public string? ItinerariesJson { get; set; }
        public string? ExtrasJson { get; set; }
    }

    public class ItineraryDto
    {
        public int DayNumber { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
    }

    public class TourExtraDto
    {
        public string? Title { get; set; }
        public decimal Price { get; set; }
        public string? Emoji { get; set; }
    }
}