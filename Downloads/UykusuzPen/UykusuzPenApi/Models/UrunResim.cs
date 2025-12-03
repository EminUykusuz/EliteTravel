using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UykusuzPenApi.Models
{
    public class UrunResim
    {
        [Key]
        public int Id { get; set; }
        
        public int UrunId { get; set; }
        
        [Required]
        [StringLength(500)]
        public string ResimYolu { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string? AltText { get; set; }
        
        [ForeignKey("UrunId")]
        public virtual Urun Urun { get; set; } = null!;
    }
}