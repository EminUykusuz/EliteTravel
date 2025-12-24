namespace EliteTravel.Core.Entities
{
    public class TourTranslation : BaseEntity
    {
        public int TourId { get; set; }
        public int LanguageId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Slug { get; set; }
        
        // JSON olarak saklanacak - Her dil için itinerary ve extra çevirileri
        public string? ItinerariesJson { get; set; } // JSON: [{ dayNumber: 1, title: "...", description: "..." }]
        public string? ExtrasJson { get; set; } // JSON: [{ title: "...", price: 50 }]
        public string? HighlightsJson { get; set; } // JSON: ["highlight 1", "highlight 2"]

        public virtual Tour Tour { get; set; } = null!;
        public virtual Language Language { get; set; } = null!;
    }
}