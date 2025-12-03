using System.ComponentModel.DataAnnotations;

namespace UykusuzPenApi.DTOs
{
    public class IletisimMesajiDto
    {
        [Required]
        public string AdSoyad { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        public string? Telefon { get; set; }
        public string? FirmaAdi { get; set; }
        public string? IsTuru { get; set; }
        [Required]
        public string Mesaj { get; set; }
    }
    
    public class IletisimMesajiListDto
    {
        public int Id { get; set; }
        public string AdSoyad { get; set; }
        public string? Email { get; set; }
        public string? Telefon { get; set; }
        public string FirmaAdi { get; set; }
        public string? IsTuru { get; set; }
        public string Mesaj { get; set; }
        public string Durum { get; set; }
        public DateTime Tarih { get; set; }
    }

    public class UpdateMessageStatusDto
    {
        [Required]
        public string Durum { get; set; } // "yeni", "okundu", "cevaplandi"
    }
}
