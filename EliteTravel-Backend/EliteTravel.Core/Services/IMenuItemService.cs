using EliteTravel.Core.DTOs;

namespace EliteTravel.Core.Services
{
    public interface IMenuItemService
    {
        Task<List<MenuItemDto>> GetAllAsync(); // 👈 MenuItemDto kullan
        Task<MenuItemDto> GetByIdAsync(int id); // 👈 MenuItemDto kullan
        Task<MenuItemDto> CreateAsync(CreateMenuItemDto dto); // 👈 MenuItemDto kullan
        Task<MenuItemDto> UpdateAsync(int id, UpdateMenuItemDto dto); // 👈 MenuItemDto kullan
        Task<bool> DeleteAsync(int id);
    }
}