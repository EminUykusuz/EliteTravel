using AutoMapper;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;

namespace EliteTravel.Service.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Tour, TourDto>().ReverseMap();
            CreateMap<Booking, BookingDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Guide, GuideDto>().ReverseMap();
            CreateMap<Itinerary, ItineraryDto>().ReverseMap();
            CreateMap<TourExtra, TourExtraDto>().ReverseMap();
            CreateMap<TourTranslation, TourTranslationDto>().ReverseMap();
            CreateMap<Language, LanguageDto>().ReverseMap();
            CreateMap<MenuItem, MenuItemDto>().ReverseMap();
            CreateMap<Page, PageDto>().ReverseMap();
            CreateMap<Contact, ContactDto>().ReverseMap();
        }
    }
}