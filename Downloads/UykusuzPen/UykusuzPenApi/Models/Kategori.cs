using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UykusuzPenApi.Models
{
    public class Kategori
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        [Column("kategori_adi")]  // Veritabanındaki gerçek kolon adı
        public string KategoriAdi { get; set; } = string.Empty;

        [Column("ust_kategori_id")]  // ← BU SATIRI EKLE
        public int? UstKategoriId { get; set; }

        [Required]
        [StringLength(255)]
        public string Slug { get; set; } = string.Empty;

        [Column("aciklama")]
        public string? Aciklama { get; set; }

        // Navigation properties
        [ForeignKey("UstKategoriId")]
        public virtual Kategori? UstKategori { get; set; }
        
        public virtual ICollection<Kategori> AltKategoriler { get; set; } = new List<Kategori>();
        public virtual ICollection<Galeri> Galeriler { get; set; } = new List<Galeri>();
        public virtual ICollection<Urun> Urunler { get; set; } = new List<Urun>();
    }
}