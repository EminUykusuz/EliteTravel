using System;

namespace EliteTravel.Core.DTOs
{
    public class PageSeoResponseDto
    {
        public int Id { get; set; }
        public string? PageKey { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Keywords { get; set; }
        public string? OgImage { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}