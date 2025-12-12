using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;

namespace EliteTravel.Core.Services
{
    // Booking'e özgü servis arayüzü
    public interface IBookingService : IService<Booking, BookingDto>
    {
        // Örn: Task<IEnumerable<BookingDto>> GetUserBookings(int userId);
    }
}