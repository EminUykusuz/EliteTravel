using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class CreateLanguageDto
    {
        [Required(ErrorMessage = "Dil kodu zorunludur")]
        [MaxLength(10)]
        public string Code { get; set; } = string.Empty;

        [Required(ErrorMessage = "Dil adı zorunludur")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public string? Icon { get; set; }
    }
}