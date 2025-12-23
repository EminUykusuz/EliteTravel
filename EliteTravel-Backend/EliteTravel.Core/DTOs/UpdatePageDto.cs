using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class UpdatePageDto
    {
        [Required]
        public int Id { get; set; }

        [MaxLength(200)]
        public string? Title { get; set; }

        public string? Content { get; set; }

        [MaxLength(250)]
        public string? Slug { get; set; }

        [MaxLength(200)]
        public string? MetaTitle { get; set; }

        [MaxLength(500)]
        public string? MetaDescription { get; set; }
    }
}