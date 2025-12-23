using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class UpdateItineraryDto
    {
        [Required]
        public int Id { get; set; }

        [Range(1, 365)]
        public int? DayNumber { get; set; }

        [MaxLength(200)]
        public string? Title { get; set; }

        public string? Description { get; set; }
        public string? Image { get; set; }
    }
}