namespace EliteTravel.Core.Entities
{
    public class Tour : BaseEntity
    {
        public Tour()
        {
            TourTranslations = new HashSet<TourTranslation>();
            Itineraries = new HashSet<Itinerary>();
            Bookings = new HashSet<Booking>();
            TourExtras = new HashSet<TourExtra>();
        }

        public decimal Price { get; set; }
        public string? Currency { get; set; }
        public int Capacity { get; set; }
        public string? MainImage { get; set; }
        public string? Thumbnail { get; set; }
        public bool IsActive { get; set; }
        public int? GuideId { get; set; }

        public virtual Guide? Guide { get; set; }
        public virtual ICollection<TourTranslation> TourTranslations { get; set; }
        public virtual ICollection<Itinerary> Itineraries { get; set; }
        public virtual ICollection<Booking> Bookings { get; set; }
        public virtual ICollection<TourExtra> TourExtras { get; set; }
    }
}