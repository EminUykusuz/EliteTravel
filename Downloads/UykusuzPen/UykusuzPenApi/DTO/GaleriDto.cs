using System.ComponentModel.DataAnnotations;

namespace UykusuzPenApi.DTOs
{
    public class GaleriDto
    {
        public int Id { get; set; }
        public string Baslik { get; set; }
         public string? Slug { get; set; }   // Yeni ekledik
        public string? Aciklama { get; set; }
        
        public KategoriDto? Kategori { get; set; }
        public string? Il { get; set; }
        public string? Ilce { get; set; }
        public string MedyaTipi { get; set; }
        public string MedyaYolu { get; set; }
        public string? KapakResmi { get; set; }
        public string? AltText { get; set; }
    }
    
    public class GaleriCreateDto
    {
        [Required(ErrorMessage = "Başlık zorunludur")]
        public string Baslik { get; set; }
        
        public string? Aciklama { get; set; }
        public int? KategoriId { get; set; }
        public string? Il { get; set; }
        public string? Ilce { get; set; }
        
        [Required(ErrorMessage = "Medya tipi zorunludur")]
        public string MedyaTipi { get; set; } = "resim";
        
        [Required(ErrorMessage = "Medya dosyası zorunludur")]
        public IFormFile MedyaDosyasi { get; set; }
        
        public IFormFile? KapakResmi { get; set; }
        public string? AltText { get; set; }
    }

    public class GaleriUpdateDto
    {
        public string? Baslik { get; set; }
        public string? Aciklama { get; set; }
        public int? KategoriId { get; set; }
        public string? Il { get; set; }
        public string? Ilce { get; set; }
        public string? MedyaTipi { get; set; }
        public IFormFile? MedyaDosyasi { get; set; }
        public IFormFile? KapakResmi { get; set; }
        public string? AltText { get; set; }
    }
}