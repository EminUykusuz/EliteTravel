namespace EliteTravel.Core.Entities
{
    public class MenuItem : BaseEntity
    {
        public MenuItem()
        {
            Children = new HashSet<MenuItem>();
            Translations = new HashSet<MenuItemTranslation>();
        }

        public string? Title { get; set; }
        public string? Url { get; set; }
        public int Order { get; set; }
        public int? ParentId { get; set; }

        // Navigation properties
        public virtual MenuItem? Parent { get; set; }
        public virtual ICollection<MenuItem> Children { get; set; }
        public virtual ICollection<MenuItemTranslation> Translations { get; set; }
    }
}