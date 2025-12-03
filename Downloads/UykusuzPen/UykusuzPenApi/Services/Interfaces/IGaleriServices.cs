// Services/GaleriService.cs
using Microsoft.EntityFrameworkCore;
using UykusuzPenApi.Data;
using UykusuzPenApi.DTOs;
using UykusuzPenApi.Services.Interfaces;

using UykusuzPenApi.DTOs;



namespace UykusuzPenApi.Services.Interfaces
{
    public interface IGaleriService
    {
        Task<IEnumerable<GaleriDto>> GetAllAsync(string? kategori = null, string? il = null, string? medyaTipi = null);
        Task<GaleriDto?> GetByIdAsync(int id);
        Task<GaleriDto> CreateAsync(GaleriCreateDto dto);
        Task<GaleriDto?> UpdateAsync(int id, GaleriUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}