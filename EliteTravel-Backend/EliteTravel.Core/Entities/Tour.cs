// EliteTravel.Core/Entities/Tour.cs
namespace EliteTravel.Core.Entities
{
    public class Tour : BaseEntity
    {
        public Tour()
        {
            TourTranslations = new HashSet<TourTranslation>();
            Itineraries = new HashSet<Itinerary>();
            TourExtras = new HashSet<TourExtra>();
            Bookings = new HashSet<Booking>();
            TourCategories = new HashSet<TourCategory>();
        }

        public string Title { get; set; } // Ana başlık
        public string? Slug { get; set; } // URL-friendly version
        public string? Description { get; set; } // Açıklama
        public decimal Price { get; set; }
        public string Currency { get; set; } = "TRY";
        public int Capacity { get; set; }
        public string? MainImage { get; set; }
        public string? Thumbnail { get; set; }  // Sadece BİR KERE olmalı!
        public bool IsActive { get; set; } = true;
        public int? GuideId { get; set; }
        
        // Yeni alanlar
        public string? DatesText { get; set; } // "21 – 26 Kasım 2025"
        public string? DepartureCity { get; set; } // "Düsseldorf (DUS)"
        public string? HighlightsJson { get; set; } // JSON array: ["Feature 1", "Feature 2"]
        public string? GalleryPhotosJson { get; set; } // JSON array: ["photo1.jpg", "photo2.jpg"]

        // Navigation properties
        public virtual Guide? Guide { get; set; }
        public virtual ICollection<TourTranslation> TourTranslations { get; set; }
        public virtual ICollection<Itinerary> Itineraries { get; set; }
        public virtual ICollection<TourExtra> TourExtras { get; set; }
        public virtual ICollection<Booking> Bookings { get; set; }
        public virtual ICollection<TourCategory> TourCategories { get; set; }
    }
}