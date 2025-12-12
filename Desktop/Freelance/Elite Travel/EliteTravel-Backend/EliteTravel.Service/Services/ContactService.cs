using AutoMapper;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Core.Repositories;
using EliteTravel.Core.Services;
using EliteTravel.Core.UnitOfWork;

namespace EliteTravel.Service.Services
{
    public class ContactService : Service<Contact, ContactDto>, IContactService
    {
        public ContactService(IGenericRepository<Contact> repository, IUnitOfWork unitOfWork, IMapper mapper) 
            : base(repository, unitOfWork, mapper)
        {
        }
    }
}