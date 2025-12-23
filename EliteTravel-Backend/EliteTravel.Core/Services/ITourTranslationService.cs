// ITourTranslationService.cs
using EliteTravel.Core.DTOs;

namespace EliteTravel.Core.Services
{
    public interface ITourTranslationService
    {
        Task<List<TourTranslationResponseDto>> GetTranslationsByTourIdAsync(int tourId);
        Task<TourTranslationResponseDto?> GetTranslationByIdAsync(int id);
        Task<TourTranslationResponseDto> CreateTranslationAsync(CreateTourTranslationDto dto);
        Task<TourTranslationResponseDto> UpdateTranslationAsync(UpdateTourTranslationDto dto);
        Task<bool> DeleteTranslationAsync(int id);
    }
}