using System;
using System.Collections.Generic;

namespace EliteTravel.Core.Entities
{
    public class TourExtra : BaseEntity
    {
        public int TourId { get; set; }
        public string? Title { get; set; }

        public virtual Tour? Tour { get; set; }
    }
}

