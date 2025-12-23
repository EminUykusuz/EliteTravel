using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class UpdateTourTranslationDto
    {
        [Required]
        public int Id { get; set; }

        [MaxLength(200)]
        public string? Title { get; set; }

        public string? Description { get; set; }

        [MaxLength(250)]
        public string? Slug { get; set; }
    }
}