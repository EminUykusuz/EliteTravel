// EliteTravel.Core/Entities/Category.cs
namespace EliteTravel.Core.Entities
{
    public class Category : BaseEntity
    {
        public Category()
        {
            TourCategories = new HashSet<TourCategory>();
            Children = new HashSet<Category>();
        }

        public string Name { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public string? Description { get; set; }
        public int? ParentId { get; set; } // Ana kategori için null
        public bool IsActive { get; set; } = true;

        // Navigation
        public virtual Category? Parent { get; set; }
        public virtual ICollection<Category> Children { get; set; }
        public virtual ICollection<TourCategory> TourCategories { get; set; }
    }
}