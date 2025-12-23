using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class UpdateLanguageDto
    {
        [Required]
        public int Id { get; set; }

        [MaxLength(10)]
        public string? Code { get; set; }

        [MaxLength(100)]
        public string? Name { get; set; }

        public string? Icon { get; set; }
    }
}