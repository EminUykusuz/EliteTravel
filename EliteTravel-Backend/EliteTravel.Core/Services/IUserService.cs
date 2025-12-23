// IUserService.cs
using EliteTravel.Core.DTOs;

namespace EliteTravel.Core.Services
{
    public interface IUserService
    {
        Task<List<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto?> GetUserByIdAsync(int id);
        Task<UserResponseDto> CreateUserAsync(CreateUserDto dto);
        Task<UserResponseDto> UpdateUserAsync(UpdateUserDto dto);
        Task<bool> DeleteUserAsync(int id);
    }
}