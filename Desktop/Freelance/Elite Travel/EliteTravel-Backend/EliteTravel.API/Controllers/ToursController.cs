using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EliteTravel.Data.Contexts;
using EliteTravel.Core.Entities;
using EliteTravel.Core.DTOs;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToursController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ToursController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Tours
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TourDto>>> GetTours()
        {
            var tours = await _context.Tours
                .Include(t => t.TourTranslations)
                    .ThenInclude(tt => tt.Language)
                .Where(t => !t.IsDeleted)
                .ToListAsync();

            var tourDtos = tours.Select(tour => new TourDto
            {
                Id = tour.Id,
                Price = tour.Price,
                Currency = tour.Currency,
                MainImage = tour.MainImage,
                Thumbnail = tour.Thumbnail,
                IsActive = tour.IsActive,
                GuideId = tour.GuideId,
                Capacity = tour.Capacity,
                CreatedDate = tour.CreatedDate,
                RemainingSlots = tour.Capacity,
                Translations = tour.TourTranslations.Select(tr => new TourTranslationDto
                {
                    Id = tr.Id,
                    TourId = tr.TourId,
                    LanguageId = tr.LanguageId,
                    LanguageCode = tr.Language?.Code, // Language tablosundan Code'u alıyoruz
                    Title = tr.Title,
                    Description = tr.Description,
                    Slug = tr.Slug
                }).ToList()
            }).ToList();

            return Ok(tourDtos);
        }

        // GET: api/Tours/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TourDto>> GetTour(int id)
        {
            var tour = await _context.Tours
                .Include(t => t.TourTranslations)
                    .ThenInclude(tt => tt.Language)
                .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);

            if (tour == null)
            {
                return NotFound();
            }

            var tourDto = new TourDto
            {
                Id = tour.Id,
                Price = tour.Price,
                Currency = tour.Currency,
                MainImage = tour.MainImage,
                Thumbnail = tour.Thumbnail,
                IsActive = tour.IsActive,
                GuideId = tour.GuideId,
                Capacity = tour.Capacity,
                CreatedDate = tour.CreatedDate,
                RemainingSlots = tour.Capacity,
                Translations = tour.TourTranslations.Select(tr => new TourTranslationDto
                {
                    Id = tr.Id,
                    TourId = tr.TourId,
                    LanguageId = tr.LanguageId,
                    LanguageCode = tr.Language?.Code,
                    Title = tr.Title,
                    Description = tr.Description,
                    Slug = tr.Slug
                }).ToList()
            };

            return Ok(tourDto);
        }

        // POST: api/Tours
        [HttpPost]
        public async Task<ActionResult<Tour>> CreateTour(TourCreateDto input)
        {
            var tour = new Tour
            {
                Price = input.Price,
                Currency = input.Currency,
                MainImage = input.MainImage,
                Thumbnail = input.Thumbnail ?? input.MainImage, // Thumbnail yoksa MainImage kullan
                IsActive = input.IsActive,
                Capacity = input.Capacity,
                GuideId = input.GuideId,
                IsDeleted = false,
                CreatedDate = System.DateTime.Now
            };

            // Translations varsa ekle
            if (input.Translations != null && input.Translations.Any())
            {
                foreach (var translation in input.Translations)
                {
                    // LanguageCode'a göre Language ID'yi bul
                    var language = await _context.Languages
                        .FirstOrDefaultAsync(l => l.Code == translation.LanguageCode);

                    if (language == null)
                    {
                        return BadRequest($"Dil kodu bulunamadı: {translation.LanguageCode}");
                    }

                    tour.TourTranslations.Add(new TourTranslation
                    {
                        LanguageId = language.Id,
                        Title = translation.Title,
                        Description = translation.Description,
                        Slug = translation.Slug,
                        CreatedDate = System.DateTime.Now,
                        IsDeleted = false
                    });
                }
            }

            _context.Tours.Add(tour);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTour", new { id = tour.Id }, tour);
        }

        // PUT: api/Tours/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTour(int id, TourUpdateDto input)
        {
            var tour = await _context.Tours
                .Include(t => t.TourTranslations)
                .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);

            if (tour == null)
            {
                return NotFound();
            }

            // Tour bilgilerini güncelle
            tour.Price = input.Price;
            tour.Currency = input.Currency;
            tour.MainImage = input.MainImage;
            tour.Thumbnail = input.Thumbnail ?? input.MainImage;
            tour.IsActive = input.IsActive;
            tour.Capacity = input.Capacity;
            tour.GuideId = input.GuideId;
            tour.UpdatedDate = System.DateTime.Now;

            // Mevcut çevirileri sil
            _context.TourTranslations.RemoveRange(tour.TourTranslations);

            // Yeni çevirileri ekle
            if (input.Translations != null && input.Translations.Any())
            {
                foreach (var translation in input.Translations)
                {
                    var language = await _context.Languages
                        .FirstOrDefaultAsync(l => l.Code == translation.LanguageCode);

                    if (language == null)
                    {
                        return BadRequest($"Dil kodu bulunamadı: {translation.LanguageCode}");
                    }

                    tour.TourTranslations.Add(new TourTranslation
                    {
                        LanguageId = language.Id,
                        Title = translation.Title,
                        Description = translation.Description,
                        Slug = translation.Slug,
                        CreatedDate = System.DateTime.Now,
                        IsDeleted = false
                    });
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Tours/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTour(int id)
        {
            var tour = await _context.Tours.FindAsync(id);

            if (tour == null)
            {
                return NotFound();
            }

            // Soft delete
            tour.IsDeleted = true;
            tour.UpdatedDate = System.DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
