namespace EliteTravel.Core.DTOs
{
    public class PageSeoDto
    {
        public int Id { get; set; }
        public string? PageKey { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Keywords { get; set; }
        public string? OgImage { get; set; }
    }

    public class UpdatePageSeoDto
    {
        public string? PageKey { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Keywords { get; set; }
        public string? OgImage { get; set; }
    }
}
