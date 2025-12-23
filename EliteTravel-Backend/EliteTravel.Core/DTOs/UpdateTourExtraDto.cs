using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class UpdateTourExtraDto
    {
        [Required]
        public int Id { get; set; }

        [MaxLength(200)]
        public string? Title { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? Price { get; set; }
    }
}