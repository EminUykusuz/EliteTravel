namespace EliteTravel.Core.DTOs
{
    public class GuideResponseDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public int? HireAmount { get; set; }
        public string? Currency { get; set; }
        public string? InstagramUrl { get; set; }
        public List<TourSimpleDto>? Tours { get; set; }
    }

    public class TourSimpleDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
    }
}