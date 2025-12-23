using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EliteTravel.Core.Entities
{
    public class TourExtra : BaseEntity
    {
        [Required]
        public int TourId { get; set; }
        
        [MaxLength(200)]
        public string? Title { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        [MaxLength(10)]
        public string? Emoji { get; set; } // Emoji için alan

        [ForeignKey(nameof(TourId))]
        public virtual Tour Tour { get; set; } = null!;
    }
}