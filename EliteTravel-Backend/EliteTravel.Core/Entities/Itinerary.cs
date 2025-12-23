namespace EliteTravel.Core.Entities
{
    public class Itinerary : BaseEntity
    {
        public int TourId { get; set; }
        public int DayNumber { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }

        public virtual Tour Tour { get; set; } = null!; // ✅ Nullable değil
    }
}