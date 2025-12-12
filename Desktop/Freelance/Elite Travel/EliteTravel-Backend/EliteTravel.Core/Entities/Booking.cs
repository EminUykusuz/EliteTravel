namespace EliteTravel.Core.Entities
{
    public class Booking : BaseEntity
    {
        public int UserId { get; set; }
        public int TourId { get; set; }
        public int GuestCount { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Status { get; set; }
        public string? Note { get; set; }

        public virtual User? User { get; set; }
        public virtual Tour? Tour { get; set; }
    }
}
