using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.Entities
{
    public class PageSeo : BaseEntity
    {
        public string? PageKey { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Keywords { get; set; }
        public string? OgImage { get; set; }
    }
}
