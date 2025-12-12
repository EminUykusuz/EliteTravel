namespace EliteTravel.Core.Entities
{
    public class TourTranslation : BaseEntity
    {
        public int TourId { get; set; }
        public int LanguageId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Slug { get; set; }

        public virtual Tour? Tour { get; set; }
        public virtual Language? Language { get; set; }
    }
}