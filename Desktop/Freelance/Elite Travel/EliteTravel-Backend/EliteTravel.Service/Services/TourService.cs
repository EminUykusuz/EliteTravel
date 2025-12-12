using AutoMapper;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Core.Repositories;
using EliteTravel.Core.Services;
using EliteTravel.Core.UnitOfWork;
using EliteTravel.Data.Contexts; 
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EliteTravel.Service.Services
{
    public class TourService : Service<Tour, TourDto>, ITourService
    {
        // İlişkili tabloları (Include) çekmek için Context'e ihtiyacımız var
        private readonly AppDbContext _context;

        public TourService(IGenericRepository<Tour> repository, IUnitOfWork unitOfWork, IMapper mapper, AppDbContext context) 
            : base(repository, unitOfWork, mapper)
        {
            _context = context;
        }

        // Turları listelerken hesaplama yap
        public override async Task<IEnumerable<TourDto>> GetAllAsync()
        {
            // Veritabanından Turları + Rezervasyonları çek
            var tours = await _context.Tours
                .Include(x => x.Bookings) // Rezervasyonları dahil et
                .Where(x => !x.IsDeleted)
                .ToListAsync();

            var dtos = _mapper.Map<List<TourDto>>(tours);

            // Her tur için hesaplama yap
            foreach (var dto in dtos)
            {
                var tour = tours.FirstOrDefault(x => x.Id == dto.Id);
                
                if (tour != null && tour.Bookings != null)
                {
                    // İptal edilmemiş rezervasyonlardaki toplam misafir sayısı
                    var bookedCount = tour.Bookings
                        .Where(b => b.Status != "Cancelled")
                        .Sum(b => b.GuestCount);

                    // Kalan = Kapasite - Satılan
                    dto.RemainingSlots = tour.Capacity - bookedCount;
                }
                else
                {
                    // Rezervasyon yoksa kalan = kapasite
                    dto.RemainingSlots = dto.Capacity;
                }
            }

            return dtos;
        }

        // Tek bir tur çekerken hesaplama yap
        public override async Task<TourDto> GetByIdAsync(int id)
        {
            var tour = await _context.Tours
                .Include(x => x.Bookings)
                .Include(x => x.Itineraries)      // Tur Programı
                .Include(x => x.TourTranslations) // Çeviriler
                .Include(x => x.Guide)            // Rehber
                .FirstOrDefaultAsync(x => x.Id == id);

            if (tour == null) return null;

            var dto = _mapper.Map<TourDto>(tour);

            // Kapasite Hesabı
            if (tour.Bookings != null)
            {
                var bookedCount = tour.Bookings
                    .Where(b => b.Status != "Cancelled")
                    .Sum(b => b.GuestCount);

                dto.RemainingSlots = tour.Capacity - bookedCount;
            }
            else
            {
                dto.RemainingSlots = dto.Capacity;
            }

            return dto;
        }
    }
}