using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UykusuzPenApi.Models
{
   public class Renk
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Renk adı zorunludur")]
        [StringLength(100)]
        public string RenkAdi { get; set; }

        // Navigation Properties
        public virtual ICollection<UrunRenk> UrunRenkler { get; set; } = new List<UrunRenk>();

        // Kategorilerle ilişki
        [ForeignKey("Kategori")]
        public int? KategoriId { get; set; }
        
        public virtual Kategori Kategori { get; set; }
    }
}