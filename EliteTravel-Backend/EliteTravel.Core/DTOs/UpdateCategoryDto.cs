using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class UpdateCategoryDto
    {
        [Required]
        public int Id { get; set; }

        [MaxLength(200)]
        public string? Name { get; set; }

        [MaxLength(250)]
        public string? Slug { get; set; }

        public string? Description { get; set; }
        public int? ParentId { get; set; }
    }
}