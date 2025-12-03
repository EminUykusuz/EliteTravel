using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UykusuzPenApi.Models
{
    [Table("galeri")]
    public class Galeri
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Required]
        [StringLength(255)]
        [Column("baslik")]
        public string Baslik { get; set; }
         public string? Slug { get; set; }   // Yeni ekledik
        
        [Column("aciklama")]
        public string? Aciklama { get; set; }
        
        [Column("kategori_id")]
        public int? KategoriId { get; set; }
        
        [StringLength(100)]
        [Column("il")]
        public string? Il { get; set; }
        
        [StringLength(100)]
        [Column("ilce")]
        public string? Ilce { get; set; }
        
        [Column("medya_tipi")]
        public string MedyaTipi { get; set; } = "resim";
        
        [Required]
        [StringLength(500)]
        [Column("medya_yolu")]
        public string MedyaYolu { get; set; }
        
        [StringLength(500)]
        [Column("kapak_resmi")]
        public string? KapakResmi { get; set; }
        
        [StringLength(255)]
        [Column("alt_text")] // ⬅️ ÖNEMLI: Veritabanında "alt_text"
        public string? AltText { get; set; }
        
        // Navigation Properties
        [ForeignKey("KategoriId")]
        public virtual Kategori? Kategori { get; set; }
    }
}