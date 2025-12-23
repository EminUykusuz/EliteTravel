using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class UpdateMenuItemDto
    {
        [Required(ErrorMessage = "Başlık zorunludur")]
        [MaxLength(200)]
        public string? Title { get; set; }

        [MaxLength(500)]
        public string? Url { get; set; }

        public int Order { get; set; }

        public int? ParentId { get; set; }

        public List<MenuItemTranslationUpsertDto>? Translations { get; set; }
    }
}