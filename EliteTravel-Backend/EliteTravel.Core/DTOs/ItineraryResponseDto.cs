using System;

namespace EliteTravel.Core.DTOs
{
    public class ItineraryResponseDto
    {
        public int Id { get; set; }
        public int TourId { get; set; }
        public int DayNumber { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}