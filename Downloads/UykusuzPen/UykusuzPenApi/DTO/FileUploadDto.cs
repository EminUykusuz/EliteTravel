using System.ComponentModel.DataAnnotations;

namespace UykusuzPenApi.DTOs
{
    public class FileUploadDto
    {
        [Required]
        public string AyarAdi { get; set; } = ""; // logo, favicon, vb.
        
        [Required]
        public IFormFile Dosya { get; set; } = null!;
        
        public string? Aciklama { get; set; }
    }
}