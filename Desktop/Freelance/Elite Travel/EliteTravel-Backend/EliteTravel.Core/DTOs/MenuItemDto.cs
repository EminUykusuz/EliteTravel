using System;

namespace EliteTravel.Core.DTOs
{
    public class MenuItemDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Url { get; set; }
        public int Order { get; set; }
        public int? ParentId { get; set; }
    }
}


