using System;

namespace EliteTravel.Core.DTOs
{
    public class ContactResponseDto
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Message { get; set; }
        public bool IsRead { get; set; }
        public string? ReplyMessage { get; set; }
        public DateTime? RepliedDate { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}