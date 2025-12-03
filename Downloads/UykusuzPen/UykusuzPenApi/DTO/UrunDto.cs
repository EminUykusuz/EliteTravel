using System.ComponentModel.DataAnnotations;

namespace UykusuzPenApi.DTOs
{
    public class UrunDto
    {
        public int Id { get; set; }
        public string UrunAdi { get; set; }
              public string Slug { get; set; } = string.Empty;
        public string? Aciklama { get; set; }
        public KategoriDto? Kategori { get; set; }
        public string? AnaResim { get; set; }
        public List<RenkDto> Renkler { get; set; } = new();
        public List<UrunResimDto> Resimler { get; set; } = new();
    }
    
    public class UrunCreateDto
    {
        [Required(ErrorMessage = "Ürün adı zorunludur")]
        public string UrunAdi { get; set; }
        public string? Slug { get; set; }
        public string? Aciklama { get; set; }
        public int? KategoriId { get; set; }
        public IFormFile? AnaResim { get; set; }
        public List<int>? RenkIds { get; set; }
        public List<IFormFile>? DigerResimler { get; set; }
    }

    public class UrunUpdateDto
    {
        public string? UrunAdi { get; set; }
        public string? Slug { get; set; } 

        public string? Aciklama { get; set; }
        public int? KategoriId { get; set; }
        public IFormFile? AnaResim { get; set; }
        public List<int>? RenkIds { get; set; }
        public List<IFormFile>? DigerResimler { get; set; }
    }

    public class UrunResimDto
    {
        public int Id { get; set; }
        public string ResimYolu { get; set; }
        public string? AltText { get; set; }
    }
}