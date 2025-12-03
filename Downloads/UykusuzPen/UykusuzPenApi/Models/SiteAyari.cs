using System.ComponentModel.DataAnnotations;

namespace UykusuzPenApi.Models
{
    public class SiteAyari
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string AyarAdi { get; set; }
        
        public string? AyarDegeri { get; set; }
        
        [StringLength(255)]
        public string? Aciklama { get; set; }
    }
}
