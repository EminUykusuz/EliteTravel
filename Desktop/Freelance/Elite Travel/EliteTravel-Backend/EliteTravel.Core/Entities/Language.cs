using System.Collections.Generic;

namespace EliteTravel.Core.Entities
{
    public class Language : BaseEntity
    {
        public Language()
        {
            TourTranslations = new HashSet<TourTranslation>();
        }

        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? Icon { get; set; }

        public virtual ICollection<TourTranslation>? TourTranslations { get; set; }
    }
}
