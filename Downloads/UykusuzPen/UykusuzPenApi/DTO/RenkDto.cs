using System.ComponentModel.DataAnnotations;

namespace UykusuzPenApi.DTOs
{
    // Renk bilgilerini döndürmek için
    public class RenkDto
    {
        public int Id { get; set; }
        public string RenkAdi { get; set; }
        public int? KategoriId { get; set; }
    }

    // Renk oluşturma/güncelleme için
    public class RenkCreateDto
    {
        [Required(ErrorMessage = "Renk adı zorunludur")]
        [StringLength(100, ErrorMessage = "Renk adı en fazla 100 karakter olabilir")]
        public string RenkAdi { get; set; }
        
        public int? KategoriId { get; set; }
    }
}