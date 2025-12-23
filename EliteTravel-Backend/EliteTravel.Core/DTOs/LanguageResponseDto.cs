using System;

namespace EliteTravel.Core.DTOs
{
    public class LanguageResponseDto
    {
        public int Id { get; set; }
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? Icon { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}