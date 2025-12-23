namespace EliteTravel.Core.Entities
{
    public class MenuItemTranslation : BaseEntity
    {
        public int MenuItemId { get; set; }
        public int LanguageId { get; set; }
        public string? Title { get; set; }

        public virtual MenuItem MenuItem { get; set; } = null!;
        public virtual Language Language { get; set; } = null!;
    }
}
