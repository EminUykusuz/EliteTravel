// EliteTravel.Core/Entities/TourCategory.cs
namespace EliteTravel.Core.Entities
{
    public class TourCategory
    {
        public int TourId { get; set; }
        public int CategoryId { get; set; }

        public virtual Tour Tour { get; set; } = null!;
        public virtual Category Category { get; set; } = null!;
    }
}