
using Microsoft.EntityFrameworkCore;

using UykusuzPenApi.Data;
using UykusuzPenApi.DTOs;
using UykusuzPenApi.Services.Interfaces;



namespace UykusuzPenApi.Services.Interfaces
{
    public interface IUrunService
    {
        Task<IEnumerable<UrunDto>> GetAllAsync(string? kategori = null);
        Task<UrunDto?> GetByIdAsync(int id);
        Task<UrunDto> CreateAsync(UrunCreateDto dto);
        Task<UrunDto?> UpdateAsync(int id, UrunUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}