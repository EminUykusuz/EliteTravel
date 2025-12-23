using System;

namespace EliteTravel.Core.DTOs
{
    public class BookingResponseDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int TourId { get; set; }
        
        // Guest Information
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        
        // Booking Details
        public int NumberOfPeople { get; set; }
        public DateTime BookingDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = "Pending";
        public string? SpecialRequests { get; set; }
        public bool IsActive { get; set; }
        
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public UserResponseDto? User { get; set; }
        public TourListDto? Tour { get; set; }
    }
}