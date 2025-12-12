using AutoMapper;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Core.Repositories;
using EliteTravel.Core.Services;
using EliteTravel.Core.UnitOfWork;

namespace EliteTravel.Service.Services
{
    public class TourTranslationService : Service<TourTranslation, TourTranslationDto>, ITourTranslationService
    {
        public TourTranslationService(IGenericRepository<TourTranslation> repository, IUnitOfWork unitOfWork, IMapper mapper) 
            : base(repository, unitOfWork, mapper)
        {
        }
    }
}