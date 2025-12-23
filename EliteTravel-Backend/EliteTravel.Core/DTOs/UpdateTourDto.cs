using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class UpdateTourDto
    {
        [Required]
        public int Id { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? Price { get; set; }

        [MaxLength(10)]
        public string? Currency { get; set; }

        [Range(1, 1000)]
        public int? Capacity { get; set; }

        public string? MainImage { get; set; }
        public string? Thumbnail { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public int? GuideId { get; set; }
    }
}