using System;
using System.Collections.Generic;

namespace EliteTravel.Core.DTOs
{
    public class TourDto
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public string? Currency { get; set; }
        public string? MainImage { get; set; }
        public string? Thumbnail { get; set; }
        public bool IsActive { get; set; }
        public int Capacity { get; set; }
        public int RemainingSlots { get; set; }
        public int? GuideId { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<TourTranslationDto>? Translations { get; set; }
    }
}
