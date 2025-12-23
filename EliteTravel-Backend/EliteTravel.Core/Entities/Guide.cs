namespace EliteTravel.Core.Entities
{
    public class Guide : BaseEntity // 👈 BaseEntity'den inherit almalı
    {
        public Guide()
        {
            Tours = new HashSet<Tour>();
            Currency = "TRY";
        }

        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public int? HireAmount { get; set; }
        public string? Currency { get; set; } // 👈 Ekle
        public string? InstagramUrl { get; set; }
        public string? Specialization { get; set; }
        public string? PhoneNumber { get; set; }
        public bool IsActive { get; set; } = true;

        public virtual ICollection<Tour> Tours { get; set; }
    }
}