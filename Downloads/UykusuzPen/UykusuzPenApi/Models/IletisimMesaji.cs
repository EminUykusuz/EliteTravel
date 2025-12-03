using System.ComponentModel.DataAnnotations;


namespace UykusuzPenApi.Models
{
    public class IletisimMesaji
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string AdSoyad { get; set; }

        [StringLength(255)]
        public string? Email { get; set; }

        [StringLength(20)]
        public string? Telefon { get; set; }

        [StringLength(255)]
        public string FirmaAdi { get; set; } = "Kişisel";

        [StringLength(255)]
        public string? IsTuru { get; set; }

        [Required]
        public string Mesaj { get; set; }

        public string Durum { get; set; } = "yeni"; // "yeni", "okundu", "cevaplandi"

        public DateTime Tarih { get; set; } = DateTime.UtcNow;
    }
}
