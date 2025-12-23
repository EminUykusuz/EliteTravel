using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class MenuItemTranslationUpsertDto
    {
        [Required]
        [MaxLength(10)]
        public string LanguageCode { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Title { get; set; }
    }
}
