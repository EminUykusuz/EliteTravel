using System.Collections.Generic;

namespace EliteTravel.Core.Entities
{
    public class Guide : BaseEntity
    {
        public Guide()
        {
            Tours = new HashSet<Tour>();
        }

        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public string? InstagramUrl { get; set; }

        public virtual ICollection<Tour>? Tours { get; set; }
    }
}
