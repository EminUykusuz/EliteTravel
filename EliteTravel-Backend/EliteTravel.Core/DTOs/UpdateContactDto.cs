using System.ComponentModel.DataAnnotations;

namespace EliteTravel.Core.DTOs
{
    public class UpdateContactDto
    {
        [Required]
        public int Id { get; set; }

        public bool IsRead { get; set; }
    }
}