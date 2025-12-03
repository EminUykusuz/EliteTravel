using UykusuzPenApi.DTOs;
using System.Threading.Tasks;

namespace UykusuzPenApi.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginDto dto);
        Task<KullaniciDto?> GetUserByIdAsync(int id);
    }
}