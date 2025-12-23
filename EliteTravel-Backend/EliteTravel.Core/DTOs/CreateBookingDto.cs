using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class CreateBookingDto
    {
        public int? UserId { get; set; } // Nullable - guest bookings için

        [Required(ErrorMessage = "Tur seçimi zorunludur")]
        public int TourId { get; set; }

        [Required(ErrorMessage = "Ad Soyad zorunludur")]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-posta zorunludur")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz")]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Telefon zorunludur")]
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Kişi sayısı zorunludur")]
        [Range(1, 100, ErrorMessage = "Kişi sayısı 1 ile 100 arasında olmalıdır")]
        public int NumberOfPeople { get; set; }

        [Required(ErrorMessage = "Tur tarihi zorunludur")]
        public DateTime BookingDate { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalPrice { get; set; }

        [MaxLength(50)]
        public string? Status { get; set; } = "Pending";

        [MaxLength(500)]
        public string? SpecialRequests { get; set; }

        public bool IsActive { get; set; } = true;
    }
}