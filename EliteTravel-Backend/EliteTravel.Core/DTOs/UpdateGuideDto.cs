using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class UpdateGuideDto
    {
        [Required]
        public int Id { get; set; }

        [MaxLength(200)]
        public string? Name { get; set; }

        public string? Description { get; set; }
        public string? Image { get; set; }

        [Range(0, int.MaxValue)]
        public int? HireAmount { get; set; }

        [Url]
        public string? InstagramUrl { get; set; }
    }
}