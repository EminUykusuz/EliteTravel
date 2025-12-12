using AutoMapper;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Core.Repositories;
using EliteTravel.Core.Services;
using EliteTravel.Core.UnitOfWork;

namespace EliteTravel.Service.Services
{
    public class MenuItemService : Service<MenuItem, MenuItemDto>, IMenuItemService
    {
        public MenuItemService(IGenericRepository<MenuItem> repository, IUnitOfWork unitOfWork, IMapper mapper) 
            : base(repository, unitOfWork, mapper)
        {
        }
    }
}