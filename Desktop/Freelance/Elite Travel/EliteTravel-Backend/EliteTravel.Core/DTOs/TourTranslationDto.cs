namespace EliteTravel.Core.DTOs
{
    public class TourTranslationDto
    {
        public int Id { get; set; }
        public int TourId { get; set; }
        public int LanguageId { get; set; }
        public string? LanguageCode { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Slug { get; set; }
    }
}

