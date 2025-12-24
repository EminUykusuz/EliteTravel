using System;
using System.Collections.Generic;

namespace EliteTravel.Core.DTOs
{
    public class TourResponseDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Slug { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? Currency { get; set; }
        public int Capacity { get; set; }
        public string? MainImage { get; set; }
        public string? Thumbnail { get; set; }
        public string[]? GalleryPhotos { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public int? GuideId { get; set; }
        public string? GuideName { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        
        // Yeni alanlar
        public string? DatesText { get; set; }
        public string? DepartureCity { get; set; }
        public string[]? Highlights { get; set; }

        public List<int>? CategoryIds { get; set; }
        public List<TourTranslationDto>? Translations { get; set; }
        public List<TourExtraDto>? Extras { get; set; }
        public List<ItineraryDto>? Itineraries { get; set; }

        public GuideResponseDto? Guide { get; set; }
        public List<TourTranslationResponseDto>? TourTranslations { get; set; }
        public List<TourExtraResponseDto>? TourExtras { get; set; }
        public List<ItineraryResponseDto>? ItineraryResponses { get; set; }
    }
}