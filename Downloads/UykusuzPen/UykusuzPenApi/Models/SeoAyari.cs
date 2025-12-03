using System.ComponentModel.DataAnnotations; // 'Required' ve 'Key' için GEREKLİ

// 1. VERİTABANI MODELİ
namespace UykusuzPenApi.Models
{
    public class SeoAyari
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string SayfaTipi { get; set; } = "anasayfa"; 
        
        public int? SayfaId { get; set; }
        
        [StringLength(255)]
        public string? Title { get; set; }
        
        public string? MetaDescription { get; set; }
        
        [StringLength(500)]
        public string? MetaKeywords { get; set; }
        
        [StringLength(500)]
        public string? Aciklama { get; set; }
    }
}
