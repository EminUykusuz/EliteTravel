using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class CreateCategoryDto
    {
        [Required(ErrorMessage = "Kategori adı zorunludur")]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(250)]
        public string? Slug { get; set; }

        public string? Description { get; set; }
        public int? ParentId { get; set; }
    }
}