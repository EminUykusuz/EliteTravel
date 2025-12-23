using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class CreateGuideDto
    {
        [Required(ErrorMessage = "Rehber adı zorunludur")]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? Image { get; set; }

        [Range(0, int.MaxValue)]
        public int? HireAmount { get; set; }

        [Url(ErrorMessage = "Geçerli bir URL giriniz")]
        public string? InstagramUrl { get; set; }
    }
}