// IPageService.cs
using EliteTravel.Core.DTOs;

namespace EliteTravel.Core.Services
{
    public interface IPageService
    {
        Task<PaginatedResultDto<PageResponseDto>> GetAllPagesAsync(int pageNumber, int pageSize);
        Task<PageResponseDto?> GetPageByIdAsync(int id);
        Task<PageResponseDto?> GetPageBySlugAsync(string slug);
        Task<PageResponseDto> CreatePageAsync(CreatePageDto dto);
        Task<PageResponseDto> UpdatePageAsync(UpdatePageDto dto);
        Task<bool> DeletePageAsync(int id);
    }
}