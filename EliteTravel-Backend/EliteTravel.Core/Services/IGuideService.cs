// IGuideService.cs
using EliteTravel.Core.DTOs;

namespace EliteTravel.Core.Services
{
    public interface IGuideService
    {
        Task<List<GuideResponseDto>> GetAllGuidesAsync();
        Task<GuideResponseDto?> GetGuideByIdAsync(int id);
        Task<GuideResponseDto> CreateGuideAsync(CreateGuideDto dto);
        Task<GuideResponseDto> UpdateGuideAsync(UpdateGuideDto dto);
        Task<bool> DeleteGuideAsync(int id);
    }
}