using System.ComponentModel.DataAnnotations;

namespace UykusuzPenApi.DTOs
{
    public class KategoriDto
    {
        public int Id { get; set; }
        public string KategoriAdi { get; set; }
        public string Slug { get; set; }
        public string? Aciklama { get; set; }
        public int? UstKategoriId { get; set; }
        public List<KategoriDto> AltKategoriler { get; set; } = new();
    }

    public class KategoriCreateDto
    {
        [Required]
        public string KategoriAdi { get; set; }
        [Required]
        public string Slug { get; set; }
        public string? Aciklama { get; set; }
        public int? UstKategoriId { get; set; }
    }
}