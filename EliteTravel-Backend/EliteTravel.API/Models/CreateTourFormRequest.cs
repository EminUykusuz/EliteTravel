namespace EliteTravel.API.Models
{
    public class CreateTourFormRequest
    {
        public string Title { get; set; }
        public string? Slug { get; set; }
        public decimal Price { get; set; }
        public string? Currency { get; set; } = "TRY";
        public int Capacity { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public int? GuideId { get; set; }
        
        public IFormFile? MainImage { get; set; }
        public IFormFile? Thumbnail { get; set; }
        
        public int[]? CategoryIds { get; set; }
        public string? DatesText { get; set; }
        public string? DepartureCity { get; set; }
        public string[]? Highlights { get; set; }
        
        public List<TourTranslationRequest>? Translations { get; set; }
        public List<ItineraryRequest>? Itineraries { get; set; }
        public List<TourExtraRequest>? Extras { get; set; }
    }

    public class TourTranslationRequest
    {
        public int LanguageId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Slug { get; set; }
        public string? ItinerariesJson { get; set; }
        public string? ExtrasJson { get; set; }
    }

    public class ItineraryRequest
    {
        public int DayNumber { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
    }

    public class TourExtraRequest
    {
        public string? Title { get; set; }
        public decimal Price { get; set; }
        public string? Emoji { get; set; }
    }
}
