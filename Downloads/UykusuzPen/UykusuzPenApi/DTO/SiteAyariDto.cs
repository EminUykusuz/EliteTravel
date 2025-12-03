using System.ComponentModel.DataAnnotations;

namespace UykusuzPenApi.DTOs
{
    public class SiteAyariDto
    {
        public string? SiteBaslik { get; set; }
        public string? Telefon { get; set; }
        public string? Email { get; set; }
        public string? Adres { get; set; }
        public string? Whatsapp { get; set; }
    }

    public class SiteAyariUpdateDto
    {
        public string? SiteBaslik { get; set; }
        public string? Telefon { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        public string? Adres { get; set; }
        public string? Whatsapp { get; set; }
    }
}
