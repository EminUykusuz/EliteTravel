// ITourExtraService.cs
using EliteTravel.Core.DTOs;

namespace EliteTravel.Core.Services
{
    public interface ITourExtraService
    {
        Task<List<TourExtraResponseDto>> GetExtrasByTourIdAsync(int tourId);
        Task<TourExtraResponseDto?> GetExtraByIdAsync(int id);
        Task<TourExtraResponseDto> CreateExtraAsync(CreateTourExtraDto dto);
        Task<TourExtraResponseDto> UpdateExtraAsync(UpdateTourExtraDto dto);
        Task<bool> DeleteExtraAsync(int id);
    }
}