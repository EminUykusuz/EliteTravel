using AutoMapper;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Core.Repositories;
using EliteTravel.Core.Services;
using EliteTravel.Core.UnitOfWork;

namespace EliteTravel.Service.Services
{
    public class TourExtraService : Service<TourExtra, TourExtraDto>, ITourExtraService
    {
        public TourExtraService(IGenericRepository<TourExtra> repository, IUnitOfWork unitOfWork, IMapper mapper) : base(repository, unitOfWork, mapper) { }
    }
}