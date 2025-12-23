using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class UpdatePageSeoDto
    {
        [Required]
        public int Id { get; set; }

        [MaxLength(100)]
        public string? PageKey { get; set; }

        [MaxLength(200)]
        public string? Title { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(500)]
        public string? Keywords { get; set; }

        public string? OgImage { get; set; }
    }
}