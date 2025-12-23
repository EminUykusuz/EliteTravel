// IContactService.cs
using EliteTravel.Core.DTOs;

namespace EliteTravel.Core.Services
{
    public interface IContactService
    {
        Task<PaginatedResultDto<ContactResponseDto>> GetAllContactsAsync(int pageNumber, int pageSize);
        Task<ContactResponseDto?> GetContactByIdAsync(int id);
        Task<ContactResponseDto> CreateContactAsync(CreateContactDto dto);
        Task<ContactResponseDto> UpdateContactAsync(UpdateContactDto dto);
        Task<bool> DeleteContactAsync(int id);
    }
}