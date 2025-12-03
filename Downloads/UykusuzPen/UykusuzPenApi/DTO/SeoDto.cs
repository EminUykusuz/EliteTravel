using System.ComponentModel.DataAnnotations;

namespace UykusuzPenApi.DTOs
{
    // C#'tan React'e veri yollamak için (GET)
    public class SeoDto
    {
        // CS8618 null hatasını engellemek için ? (nullable) kullanıyoruz
        public string? Title { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
    }

    // React'ten C#'a veri kaydetmek için (POST)
    public class SeoUpdateDto
    {
        public int? Id { get; set; }

        [Required(ErrorMessage = "Sayfa tipi zorunludur.")]
        public string SayfaTipi { get; set; } = ""; // CS8618 için = ""

        public int? SayfaId { get; set; }

        [Required(ErrorMessage = "Title zorunludur.")]
        public string Title { get; set; } = ""; // CS8618 için = ""

        // React'in yolladığı isimle C#'ın beklediği isim artık aynı
        public string? MetaDescription { get; set; }

        public string? MetaKeywords { get; set; }

        public string? Aciklama { get; set; }
    }
}
