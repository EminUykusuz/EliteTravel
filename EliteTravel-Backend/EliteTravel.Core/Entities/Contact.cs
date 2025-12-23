using System;
using System.Collections.Generic;

namespace EliteTravel.Core.Entities
{
    public class Contact : BaseEntity
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Message { get; set; }
        public bool IsRead { get; set; }
        public string? ReplyMessage { get; set; }
        public DateTime? RepliedDate { get; set; }
    }
}

