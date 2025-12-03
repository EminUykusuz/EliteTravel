using System.ComponentModel.DataAnnotations;

namespace UykusuzPenApi.Models
{
    public class Kullanici
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string KullaniciAdi { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Sifre { get; set; } // Hash'lenmiş
        
        [StringLength(255)]
        public string? AdSoyad { get; set; }
        
        [StringLength(255)]
        public string? Email { get; set; }
    }
}