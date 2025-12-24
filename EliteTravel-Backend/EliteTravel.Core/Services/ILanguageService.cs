// ILanguageService.cs
using EliteTravel.Core.DTOs;

namespace EliteTravel.Core.Services
{
    public interface ILanguageService
    {
        Task<List<LanguageResponseDto>> GetAllLanguagesAsync();
        Task<LanguageResponseDto?> GetLanguageByIdAsync(int id);
        Task<LanguageResponseDto?> GetByCodeAsync(string code);
        Task<LanguageResponseDto> CreateLanguageAsync(CreateLanguageDto dto);
        Task<LanguageResponseDto> UpdateLanguageAsync(UpdateLanguageDto dto);
        Task<bool> DeleteLanguageAsync(int id);
    }
}