using AutoMapper;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Core.Repositories;
using EliteTravel.Core.Services;
using EliteTravel.Core.UnitOfWork;

namespace EliteTravel.Service.Services
{
    public class ItineraryService : Service<Itinerary, ItineraryDto>, IItineraryService
    {
        public ItineraryService(IGenericRepository<Itinerary> repository, IUnitOfWork unitOfWork, IMapper mapper) : base(repository, unitOfWork, mapper) { }
    }
}