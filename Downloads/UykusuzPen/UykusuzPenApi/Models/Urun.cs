using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UykusuzPenApi.Models
{
    public class Urun
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string UrunAdi { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;

        public string? Aciklama { get; set; }

        public int? KategoriId { get; set; }

        [StringLength(500)]
        public string? AnaResim { get; set; }

        [ForeignKey("KategoriId")]
        public virtual Kategori? Kategori { get; set; }

        public virtual ICollection<UrunResim> UrunResimleri { get; set; } = new List<UrunResim>();
        public virtual ICollection<UrunRenk> UrunRenkler { get; set; } = new List<UrunRenk>();
    }
    
    


}