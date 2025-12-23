using System.Collections.Generic;

namespace EliteTravel.Core.Entities
{
    public class User : BaseEntity
    {
        public User()
        {
            Bookings = new HashSet<Booking>();
        }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PasswordHash { get; set; }
        public string? Role { get; set; }
        
        // 2FA Fields
        public bool TwoFAEnabled { get; set; } = false;
        public string? TwoFASecret { get; set; }
        public bool GoogleAuthEnabled { get; set; } = false;
        public string? GoogleAuthId { get; set; }

        public virtual ICollection<Booking> Bookings { get; set; }
    }
}