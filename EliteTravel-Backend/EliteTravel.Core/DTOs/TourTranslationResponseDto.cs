using System;

namespace EliteTravel.Core.DTOs
{
    public class TourTranslationResponseDto
    {
        public int Id { get; set; }
        public int TourId { get; set; }
        public int LanguageId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Slug { get; set; }
        public DateTime CreatedDate { get; set; }

        // JSON alanları - çeviriler için
        public string? ItinerariesJson { get; set; }
        public string? ExtrasJson { get; set; }
        public string? HighlightsJson { get; set; }

        public LanguageResponseDto? Language { get; set; }
    }
}