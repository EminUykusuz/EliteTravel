using System;

namespace EliteTravel.Core.DTOs
{
    public class TourExtraResponseDto
    {
        public int Id { get; set; }
        public int TourId { get; set; }
        public string? Title { get; set; }
        public decimal Price { get; set; }
        public string? Emoji { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}