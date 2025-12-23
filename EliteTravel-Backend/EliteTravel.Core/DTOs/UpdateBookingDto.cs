using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class UpdateBookingDto
    {
        [Required]
        public int Id { get; set; }

        [MaxLength(100)]
        public string? FullName { get; set; }

        [EmailAddress]
        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        [Range(1, 100)]
        public int? NumberOfPeople { get; set; }

        public DateTime? BookingDate { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? TotalPrice { get; set; }

        [MaxLength(50)]
        public string? Status { get; set; }

        [MaxLength(500)]
        public string? SpecialRequests { get; set; }

        public bool? IsActive { get; set; }
    }
}