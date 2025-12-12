using System;
using System.Collections.Generic;

namespace EliteTravel.Core.Entities
{
   public class MenuItem : BaseEntity
    {
        public string? Title { get; set; }
        public string? Url { get; set; }
        public int Order { get; set; }
        public int? ParentId { get; set; }
    }
}
