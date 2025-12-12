namespace EliteTravel.Core.DTOs
{
    public class CreateTourTranslationDto
    {
        public string? LanguageCode { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Slug { get; set; }
    }
}

