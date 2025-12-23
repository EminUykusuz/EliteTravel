using System;
using System.Collections.Generic;

namespace EliteTravel.Core.DTOs
{
    public class CategoryResponseDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Slug { get; set; }
        public string? Description { get; set; }
        public int? ParentId { get; set; }
        public DateTime CreatedDate { get; set; }

        public List<CategoryResponseDto>? Children { get; set; }
    }
}