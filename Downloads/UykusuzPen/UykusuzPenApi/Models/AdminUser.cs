using System.ComponentModel.DataAnnotations.Schema; // <-- 1. BUNU EKLE

namespace UykusuzPenApi.Models

{
    [Table("admin_users")]
    public class AdminUser
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // BCrypt hash
        public int FailedLoginCount { get; set; } = 0;
        public DateTime? LockoutEnd { get; set; } = null;
    }
}