namespace EliteTravel.Core.DTOs
{
    public class BookingDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TourId { get; set; }
        public int GuestCount { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Status { get; set; }
        public string? Note { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}

