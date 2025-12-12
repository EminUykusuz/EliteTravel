using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;

namespace EliteTravel.Core.Services
{
    // IService'in tüm özelliklerini alır + Tura özel metodlar eklenebilir.
    public interface ITourService : IService<Tour, TourDto>
    {
        // İleride buraya özel metodlar ekleyebiliriz.
        // Örn: Task<List<TourDto>> GetPopularTours();
    }
}