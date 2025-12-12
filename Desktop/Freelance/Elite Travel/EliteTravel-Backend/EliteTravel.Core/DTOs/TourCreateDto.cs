namespace EliteTravel.Core.DTOs
{
    public class TourCreateDto
    {
        public decimal Price { get; set; }
        public string? Currency { get; set; }
        public string? MainImage { get; set; }
        public string? Thumbnail { get; set; }
        public bool IsActive { get; set; }
        public int Capacity { get; set; }
        public int? GuideId { get; set; }
        public List<CreateTourTranslationDto>? Translations { get; set; }
    }
}

