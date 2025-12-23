// IBookingService.cs
using EliteTravel.Core.DTOs;

namespace EliteTravel.Core.Services
{
    public interface IBookingService
    {
        Task<PaginatedResultDto<BookingResponseDto>> GetAllBookingsAsync(int pageNumber, int pageSize);
        Task<BookingResponseDto?> GetBookingByIdAsync(int id);
        Task<BookingResponseDto> CreateBookingAsync(CreateBookingDto dto);
        Task<BookingResponseDto> UpdateBookingAsync(UpdateBookingDto dto);
        Task<bool> DeleteBookingAsync(int id);
    }
}