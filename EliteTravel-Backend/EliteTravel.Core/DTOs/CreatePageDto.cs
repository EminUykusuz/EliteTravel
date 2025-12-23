using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class CreatePageDto
    {
        [Required(ErrorMessage = "Başlık zorunludur")]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "İçerik zorunludur")]
        public string Content { get; set; } = string.Empty;

        [Required(ErrorMessage = "Slug zorunludur")]
        [MaxLength(250)]
        public string Slug { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? MetaTitle { get; set; }

        [MaxLength(500)]
        public string? MetaDescription { get; set; }
    }
}