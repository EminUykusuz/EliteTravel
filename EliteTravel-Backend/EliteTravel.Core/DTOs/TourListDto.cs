namespace EliteTravel.Core.DTOs
{
    public class TourListDto
    {
        public int Id { get; set; }
        public string? Slug { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? Currency { get; set; }
        public int Capacity { get; set; }
        public string? MainImage { get; set; }
        public string? Thumbnail { get; set; }
        public bool IsActive { get; set; }
        public string? GuideName { get; set; }
    }
}