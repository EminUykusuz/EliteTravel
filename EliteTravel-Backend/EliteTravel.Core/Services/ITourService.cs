// ITourService.cs
using EliteTravel.Core.DTOs;

namespace EliteTravel.Core.Services
{
    public interface ITourService
    {
        Task<PaginatedResultDto<TourListDto>> GetAllToursAsync(int pageNumber, int pageSize);
        Task<TourResponseDto?> GetTourByIdAsync(int id);
        Task<TourResponseDto> CreateTourAsync(CreateTourDto dto);
        Task<TourResponseDto> UpdateTourAsync(UpdateTourDto dto);
        Task<bool> DeleteTourAsync(int id);
    }
}