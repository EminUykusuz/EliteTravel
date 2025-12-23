namespace EliteTravel.Core.Entities
{
    public class Booking : BaseEntity
    {
        public int? UserId { get; set; } // Nullable - for guest bookings
        public int TourId { get; set; }
        
        // Guest Information
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        
        // Booking Details
        public int NumberOfPeople { get; set; }
        public DateTime BookingDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled
        public string? SpecialRequests { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public virtual User? User { get; set; }
        public virtual Tour Tour { get; set; } = null!;
    }
}