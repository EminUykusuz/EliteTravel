using System.ComponentModel.DataAnnotations;

namespace UykusuzPenApi.Models
{
    public class UrunRenk
    {
        public int Id { get; set; }
        public int UrunId { get; set; }
        public int RenkId { get; set; }
        
        public virtual Urun Urun { get; set; }
        public virtual Renk Renk { get; set; }
    }
}