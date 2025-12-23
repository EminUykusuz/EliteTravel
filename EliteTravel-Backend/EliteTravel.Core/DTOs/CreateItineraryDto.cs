using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class CreateItineraryDto
    {
        [Required]
        public int TourId { get; set; }

        [Required(ErrorMessage = "Gün numarası zorunludur")]
        [Range(1, 365)]
        public int DayNumber { get; set; }

        [Required(ErrorMessage = "Başlık zorunludur")]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? Image { get; set; }
    }
}