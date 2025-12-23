namespace EliteTravel.Core.Entities
{
    public class Language : BaseEntity
    {
        public Language()
        {
            TourTranslations = new HashSet<TourTranslation>();
            MenuItemTranslations = new HashSet<MenuItemTranslation>();
        }

        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? Icon { get; set; }

        public virtual ICollection<TourTranslation> TourTranslations { get; set; } // ✅ Nullable değil
        public virtual ICollection<MenuItemTranslation> MenuItemTranslations { get; set; }
    }
}