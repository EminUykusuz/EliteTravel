// IItineraryService.cs
using EliteTravel.Core.DTOs;

namespace EliteTravel.Core.Services
{
    public interface IItineraryService
    {
        Task<List<ItineraryResponseDto>> GetItinerariesByTourIdAsync(int tourId);
        Task<ItineraryResponseDto?> GetItineraryByIdAsync(int id);
        Task<ItineraryResponseDto> CreateItineraryAsync(CreateItineraryDto dto);
        Task<ItineraryResponseDto> UpdateItineraryAsync(UpdateItineraryDto dto);
        Task<bool> DeleteItineraryAsync(int id);
    }
}