using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class CreateTourExtraDto
    {
        [Required]
        public int TourId { get; set; }

        [Required(ErrorMessage = "Başlık zorunludur")]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Fiyat zorunludur")]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
    }
}