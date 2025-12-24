using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Data;
using EliteTravel.Data.Contexts;
using Microsoft.EntityFrameworkCore;
using EliteTravel.API.Models;
using System.Text.Json;


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
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? categoryId = null,
            [FromQuery] string? category = null, // Slug ile kategori filtreleme
            [FromQuery] bool? isActive = null,
            [FromQuery] string? languageCode = null)
        {
            Console.WriteLine($"🔍 GetAll çağrıldı - categoryId: {categoryId}, category: {category}, isActive: {isActive}, languageCode: {languageCode}");
            
            int? languageId = null;
            if (!string.IsNullOrWhiteSpace(languageCode))
            {
                languageId = await _context.Languages
                    .Where(l => !l.IsDeleted && l.Code == languageCode)
                    .Select(l => (int?)l.Id)
                    .FirstOrDefaultAsync();
            }

            var query = _context.Tours
                .Include(t => t.Guide)
                .Include(t => t.TourCategories)
                .ThenInclude(tc => tc.Category)
                .Include(t => t.TourTranslations)
                .Where(t => !t.IsDeleted);

            // Kategori filtresi (slug ile)
            if (!string.IsNullOrWhiteSpace(category))
            {
                Console.WriteLine($"📦 Kategori slug filtresi uygulanıyor: Category = {category}");
                
                // Kategoriyi bul
                var categoryEntity = await _context.Categories
                    .Include(c => c.Children)
                    .FirstOrDefaultAsync(c => c.Slug == category && !c.IsDeleted);
                
                if (categoryEntity != null)
                {
                    // Eğer parent kategori ise, hem kendisini hem child'larını al
                    var categoryIds = new List<int> { categoryEntity.Id };
                    if (categoryEntity.Children != null && categoryEntity.Children.Any())
                    {
                        categoryIds.AddRange(categoryEntity.Children.Select(c => c.Id));
                        Console.WriteLine($"👶 Parent kategori - Alt kategoriler dahil: {string.Join(", ", categoryIds)}");
                    }
                    
                    query = query.Where(t => t.TourCategories.Any(tc => categoryIds.Contains(tc.CategoryId)));
                }
                else
                {
                    Console.WriteLine($"⚠️ Kategori bulunamadı: {category}");
                }
            }
            // Kategori filtresi (ID ile - backward compatibility)
            else if (categoryId.HasValue)
            {
                Console.WriteLine($"📦 Kategori ID filtresi uygulanıyor: CategoryId = {categoryId.Value}");
                query = query.Where(t => t.TourCategories.Any(tc => tc.CategoryId == categoryId.Value));
            }

            // Aktiflik filtresi
            if (isActive.HasValue)
            {
                query = query.Where(t => t.IsActive == isActive.Value);
            }

            var tours = await query
                .Select(t => new TourListDto
                {
                    Id = t.Id,
                    Slug = languageId.HasValue
                        ? (t.TourTranslations.Where(tt => tt.LanguageId == languageId.Value).Select(tt => tt.Slug).FirstOrDefault() ?? t.Slug)
                        : t.Slug,
                    Title = languageId.HasValue
                        ? (t.TourTranslations.Where(tt => tt.LanguageId == languageId.Value).Select(tt => tt.Title).FirstOrDefault() ?? t.Title)
                        : (t.TourTranslations.Select(tt => tt.Title).FirstOrDefault() ?? t.Title),
                    Description = languageId.HasValue
                        ? (t.TourTranslations.Where(tt => tt.LanguageId == languageId.Value).Select(tt => tt.Description).FirstOrDefault() ?? t.Description)
                        : (t.TourTranslations.Select(tt => tt.Description).FirstOrDefault() ?? t.Description),
                    Price = t.Price,
                    Currency = t.Currency,
                    Capacity = t.Capacity,
                    MainImage = t.MainImage != null ? "/api/tours/image/" + t.MainImage.Replace("/uploads/tours/", "") : null,
                    Thumbnail = t.Thumbnail != null ? "/api/tours/image/" + t.Thumbnail.Replace("/uploads/tours/", "") : null,
                    IsActive = t.IsActive,
                    GuideName = t.Guide != null ? t.Guide.Name : null
                })
                .ToListAsync();

            Console.WriteLine($"✅ Sorgu sonucu: {tours.Count} tur bulundu");
            if (categoryId.HasValue && tours.Any())
            {
                var firstTour = tours.First();
                Console.WriteLine($"📋 İlk turun adı: {firstTour.Title}");
            }

            return Ok(tours);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<TourResponseDto>>> GetById(int id)
        {
            var tour = await _context.Tours
                .Include(t => t.Guide)
                .Include(t => t.TourTranslations)
                .Include(t => t.TourCategories).ThenInclude(tc => tc.Category)
                .Include(t => t.Itineraries)
                .Include(t => t.TourExtras)
                .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);

            if (tour == null)
                return NotFound(ApiResponseDto<TourResponseDto>.ErrorResponse("Tur bulunamadı"));

            var response = new TourResponseDto
            {
                Id = tour.Id,
                Title = tour.Title,
                Slug = tour.Slug,
                Price = tour.Price,
                Currency = tour.Currency,
                Capacity = tour.Capacity,
                MainImage = tour.MainImage != null ? "/api/tours/image/" + tour.MainImage.Replace("/uploads/tours/", "") : null,
                Thumbnail = tour.Thumbnail != null ? "/api/tours/image/" + tour.Thumbnail.Replace("/uploads/tours/", "") : null,
                Description = tour.Description,
                IsActive = tour.IsActive,
                GuideId = tour.GuideId,
                GuideName = tour.Guide?.Name,
                DatesText = tour.DatesText,
                DepartureCity = tour.DepartureCity,
                Highlights = !string.IsNullOrEmpty(tour.HighlightsJson) 
                    ? JsonSerializer.Deserialize<string[]>(tour.HighlightsJson) 
                    : null,
                CreatedDate = tour.CreatedDate,
                CategoryIds = tour.TourCategories?.Select(tc => tc.CategoryId).ToList(),
                Translations = tour.TourTranslations?.Select(tt => new TourTranslationDto
                {
                    LanguageId = tt.LanguageId,
                    Title = tt.Title,
                    Description = tt.Description,
                    Slug = tt.Slug,
                    ItinerariesJson = tt.ItinerariesJson,
                    ExtrasJson = tt.ExtrasJson
                }).ToList(),
                Itineraries = tour.Itineraries?.Select(it => new ItineraryDto
                {
                    DayNumber = it.DayNumber,
                    Title = it.Title,
                    Description = it.Description
                }).ToList(),
                Extras = tour.TourExtras?.Select(te => new TourExtraDto
                {
                    Title = te.Title,
                    Price = te.Price,
                    Emoji = te.Emoji
                }).ToList()
            };

            return Ok(ApiResponseDto<TourResponseDto>.SuccessResponse(response, "Tur başarıyla getirildi"));
        }

        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<ApiResponseDto<TourResponseDto>>> GetBySlug(string slug)
        {
            var tour = await _context.Tours
                .Include(t => t.Guide)
                .Include(t => t.TourTranslations)
                .Include(t => t.TourCategories).ThenInclude(tc => tc.Category)
                .Include(t => t.Itineraries)
                .Include(t => t.TourExtras)
                .FirstOrDefaultAsync(t => !t.IsDeleted &&
                    ((t.Slug != null && t.Slug == slug) ||
                     t.TourTranslations.Any(tr => tr.Slug != null && tr.Slug == slug)));

            if (tour == null)
                return NotFound(ApiResponseDto<TourResponseDto>.ErrorResponse("Tur bulunamadı"));

            var response = new TourResponseDto
            {
                Id = tour.Id,
                Title = tour.Title,
                Slug = tour.Slug,
                Price = tour.Price,
                Currency = tour.Currency,
                Capacity = tour.Capacity,
                MainImage = tour.MainImage != null ? "/api/tours/image/" + tour.MainImage.Replace("/uploads/tours/", "") : null,
                Thumbnail = tour.Thumbnail != null ? "/api/tours/image/" + tour.Thumbnail.Replace("/uploads/tours/", "") : null,
                Description = tour.Description,
                IsActive = tour.IsActive,
                GuideId = tour.GuideId,
                GuideName = tour.Guide?.Name,
                DatesText = tour.DatesText,
                DepartureCity = tour.DepartureCity,
                Highlights = !string.IsNullOrEmpty(tour.HighlightsJson) 
                    ? JsonSerializer.Deserialize<string[]>(tour.HighlightsJson) 
                    : null,
                CreatedDate = tour.CreatedDate,
                CategoryIds = tour.TourCategories?.Select(tc => tc.CategoryId).ToList(),
                Translations = tour.TourTranslations?.Select(tt => new TourTranslationDto
                {
                    LanguageId = tt.LanguageId,
                    Title = tt.Title,
                    Description = tt.Description,
                    Slug = tt.Slug,
                    ItinerariesJson = tt.ItinerariesJson,
                    ExtrasJson = tt.ExtrasJson
                }).ToList(),
                Itineraries = tour.Itineraries?.Select(it => new ItineraryDto
                {
                    DayNumber = it.DayNumber,
                    Title = it.Title,
                    Description = it.Description
                }).ToList(),
                Extras = tour.TourExtras?.Select(te => new TourExtraDto
                {
                    Title = te.Title,
                    Price = te.Price,
                    Emoji = te.Emoji
                }).ToList()
            };

            return Ok(ApiResponseDto<TourResponseDto>.SuccessResponse(response, "Tur başarıyla getirildi"));
        }
        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<TourResponseDto>>> Create([FromForm] CreateTourFormRequest request)
        {
            // DEBUG: Log incoming request data
            Console.WriteLine($"=== CREATE TOUR REQUEST ===");
            Console.WriteLine($"Title: {request.Title}");
            Console.WriteLine($"Price: {request.Price}, Capacity: {request.Capacity}");
            Console.WriteLine($"CategoryIds: {request.CategoryIds?.Length ?? 0}");
            Console.WriteLine($"Translations: {request.Translations?.Count ?? 0}");
            Console.WriteLine($"Itineraries: {request.Itineraries?.Count ?? 0}");
            if (request.Itineraries != null && request.Itineraries.Any())
            {
                foreach (var iter in request.Itineraries)
                {
                    Console.WriteLine($"  📅 Day {iter.DayNumber}: '{iter.Title}' (Desc: {(string.IsNullOrWhiteSpace(iter.Description) ? "yok" : "var")})");
                }
            }
            else
            {
                Console.WriteLine($"  ⚠️ ITINERARYİ YOK!");
            }
            Console.WriteLine($"Extras: {request.Extras?.Count ?? 0}");
            Console.WriteLine($"===========================");
            
            // Basic validation
            if (string.IsNullOrWhiteSpace(request.Title) || request.Price <= 0 || request.Capacity <= 0)
            {
                return BadRequest(ApiResponseDto<TourResponseDto>.ErrorResponse("Başlık, fiyat ve kapasite zorunludur"));
            }

            try
            {
                // Dosyaları kaydet
                var mainImagePath = await SaveFileAsync(request.MainImage);
                var thumbnailPath = await SaveFileAsync(request.Thumbnail);

                // Yeni tour oluştur
                var tour = new Tour
                {
                    Title = request.Title,
                    Slug = request.Slug ?? request.Title.ToLower().Replace(" ", "-"),
                    Price = request.Price,
                    Currency = request.Currency ?? "TRY",
                    Capacity = request.Capacity,
                    MainImage = mainImagePath,
                    Thumbnail = thumbnailPath,
                    Description = request.Description,
                    IsActive = request.IsActive,
                    GuideId = request.GuideId,
                    DatesText = request.DatesText,
                    DepartureCity = request.DepartureCity,
                    HighlightsJson = request.Highlights != null && request.Highlights.Any() 
                        ? JsonSerializer.Serialize(request.Highlights) 
                        : null,
                    CreatedDate = DateTime.UtcNow
                };

                _context.Tours.Add(tour);
                await _context.SaveChangesAsync();

                // Kategorileri ekle
                // Kategorileri ekle
                if (request.CategoryIds != null && request.CategoryIds.Any())
                {
                    foreach (var categoryId in request.CategoryIds)
                    {
                        _context.TourCategories.Add(new TourCategory
                        {
                            TourId = tour.Id,
                            CategoryId = categoryId
                        });
                    }
                    await _context.SaveChangesAsync();
                }

                // Çeviriler ekle
                if (request.Translations != null && request.Translations.Any())
                {
                    foreach (var translation in request.Translations)
                    {
                        // Skip empty translations or invalid language IDs
                        if (translation.LanguageId <= 0 || string.IsNullOrWhiteSpace(translation.Title))
                            continue;

                        _context.TourTranslations.Add(new TourTranslation
                        {
                            TourId = tour.Id,
                            LanguageId = translation.LanguageId,
                            Title = translation.Title,
                            Description = translation.Description,
                            Slug = translation.Slug,
                            ItinerariesJson = translation.ItinerariesJson, // JSON olarak sakla
                            ExtrasJson = translation.ExtrasJson // JSON olarak sakla
                        });
                        
                        Console.WriteLine($"🌍 Çeviri eklendi - Dil: {translation.LanguageId}, JSON: Itin={!string.IsNullOrEmpty(translation.ItinerariesJson)}, Extra={!string.IsNullOrEmpty(translation.ExtrasJson)}");
                    }
                    if (_context.ChangeTracker.HasChanges())
                    {
                        await _context.SaveChangesAsync();
                        Console.WriteLine($"✅ {request.Translations.Count} çeviri kaydedildi");
                    }
                }

                // İtinerary'ler ekle
                if (request.Itineraries != null && request.Itineraries.Any())
                {
                    foreach (var itinerary in request.Itineraries)
                    {
                        // Skip empty itineraries
                        if (itinerary.DayNumber <= 0 || string.IsNullOrWhiteSpace(itinerary.Title))
                            continue;

                        _context.Itineraries.Add(new Itinerary
                        {
                            TourId = tour.Id,
                            DayNumber = itinerary.DayNumber,
                            Title = itinerary.Title,
                            Description = itinerary.Description
                        });
                    }
                    if (_context.ChangeTracker.HasChanges())
                    {
                        await _context.SaveChangesAsync();
                    }
                }

                // Ekstralar ekle
                if (request.Extras != null && request.Extras.Any())
                {
                    Console.WriteLine($"📦 {request.Extras.Count} adet Extra geldi");
                    foreach (var extra in request.Extras)
                    {
                        Console.WriteLine($"  Extra: '{extra.Emoji} {extra.Title}' - {extra.Price}€");
                        // Skip empty extras
                        if (string.IsNullOrWhiteSpace(extra.Title) || extra.Price < 0)
                        {
                            Console.WriteLine($"  ⚠️ Extra atlandı (boş veya geçersiz)");
                            continue;
                        }

                        _context.TourExtras.Add(new TourExtra
                        {
                            TourId = tour.Id,
                            Title = extra.Title,
                            Price = extra.Price,
                            Emoji = extra.Emoji
                        });
                        Console.WriteLine($"  ✅ Extra eklendi: {extra.Emoji} {extra.Title}");
                    }
                    if (_context.ChangeTracker.HasChanges())
                    {
                        await _context.SaveChangesAsync();
                        Console.WriteLine($"✅ Tüm Extra'lar kaydedildi");
                    }
                }
                else
                {
                    Console.WriteLine("⚠️ Hiç Extra gelmedi!");
                }

                var response = new TourResponseDto
                {
                    Id = tour.Id,
                    Title = tour.Title,
                    Price = tour.Price,
                    Capacity = tour.Capacity,
                    IsActive = tour.IsActive
                };

                return CreatedAtAction(nameof(GetById), new { id = tour.Id },
                    ApiResponseDto<TourResponseDto>.SuccessResponse(response, "Tour created successfully"));
            }
            catch (Exception ex)
            {
                var errorMessage = ex.Message;
                if (ex.InnerException != null)
                {
                    errorMessage += " | Inner: " + ex.InnerException.Message;
                }
                
                // Log detailed error
                System.Diagnostics.Debug.WriteLine($"Tour Creation Error: {ex}");
                
                return BadRequest(ApiResponseDto<TourResponseDto>.ErrorResponse($"Error creating tour: {errorMessage}"));
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<TourResponseDto>>> Update(int id, [FromForm] CreateTourFormRequest request)
        {
            Console.WriteLine($"=== UPDATE TOUR REQUEST (ID: {id}) ===");
            Console.WriteLine($"Title: {request.Title}");
            Console.WriteLine($"Extras: {request.Extras?.Count ?? 0}");
            
            try
            {
                var tour = await _context.Tours
                    .Include(t => t.TourTranslations)
                    .Include(t => t.TourCategories)
                    .Include(t => t.Itineraries)
                    .Include(t => t.TourExtras)
                    .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);

                if (tour == null)
                    return NotFound(ApiResponseDto<TourResponseDto>.ErrorResponse("Tur bulunamadı"));

                // Eski dosyaları sakla (yeni yükleme yoksa kullanılacak)
                var oldMainImage = tour.MainImage;
                var oldThumbnail = tour.Thumbnail;

                // Yeni dosyalar varsa kaydet
                if (request.MainImage != null)
                {
                    if (!string.IsNullOrEmpty(oldMainImage))
                        DeleteFile(oldMainImage);
                    tour.MainImage = await SaveFileAsync(request.MainImage);
                }
                if (request.Thumbnail != null)
                {
                    if (!string.IsNullOrEmpty(oldThumbnail))
                        DeleteFile(oldThumbnail);
                    tour.Thumbnail = await SaveFileAsync(request.Thumbnail);
                }

                // Temel bilgileri güncelle
                tour.Title = request.Title;
                tour.Slug = request.Slug ?? request.Title.ToLower().Replace(" ", "-");
                tour.Price = request.Price;
                tour.Currency = request.Currency ?? "EUR";
                tour.Capacity = request.Capacity;
                tour.Description = request.Description;
                tour.IsActive = request.IsActive;
                tour.GuideId = request.GuideId;
                tour.DatesText = request.DatesText;
                tour.DepartureCity = request.DepartureCity;
                tour.HighlightsJson = request.Highlights != null && request.Highlights.Any() 
                    ? JsonSerializer.Serialize(request.Highlights) 
                    : null;
                tour.UpdatedDate = DateTime.UtcNow;

                // Kategorileri güncelle - önce eskilerini sil
                _context.TourCategories.RemoveRange(tour.TourCategories);
                if (request.CategoryIds != null && request.CategoryIds.Any())
                {
                    foreach (var categoryId in request.CategoryIds)
                    {
                        _context.TourCategories.Add(new TourCategory
                        {
                            TourId = tour.Id,
                            CategoryId = categoryId
                        });
                    }
                }

                // Çevirileri güncelle - önce eskilerini sil
                _context.TourTranslations.RemoveRange(tour.TourTranslations);
                if (request.Translations != null && request.Translations.Any())
                {
                    foreach (var translation in request.Translations)
                    {
                        if (translation.LanguageId <= 0 || string.IsNullOrWhiteSpace(translation.Title))
                            continue;

                        _context.TourTranslations.Add(new TourTranslation
                        {
                            TourId = tour.Id,
                            LanguageId = translation.LanguageId,
                            Title = translation.Title,
                            Description = translation.Description,
                            Slug = translation.Slug,
                            ItinerariesJson = translation.ItinerariesJson,
                            ExtrasJson = translation.ExtrasJson
                        });
                    }
                }

                // İtinerary'leri güncelle - önce eskilerini sil
                _context.Itineraries.RemoveRange(tour.Itineraries);
                if (request.Itineraries != null && request.Itineraries.Any())
                {
                    foreach (var itinerary in request.Itineraries)
                    {
                        if (itinerary.DayNumber <= 0 || string.IsNullOrWhiteSpace(itinerary.Title))
                            continue;

                        _context.Itineraries.Add(new Itinerary
                        {
                            TourId = tour.Id,
                            DayNumber = itinerary.DayNumber,
                            Title = itinerary.Title,
                            Description = itinerary.Description
                        });
                    }
                }

                // Ekstraları güncelle - önce eskilerini sil
                _context.TourExtras.RemoveRange(tour.TourExtras);
                if (request.Extras != null && request.Extras.Any())
                {
                    Console.WriteLine($"📦 {request.Extras.Count} adet Extra geldi (UPDATE)");
                    foreach (var extra in request.Extras)
                    {
                        if (string.IsNullOrWhiteSpace(extra.Title))
                            continue;

                        _context.TourExtras.Add(new TourExtra
                        {
                            TourId = tour.Id,
                            Title = extra.Title,
                            Price = extra.Price,
                            Emoji = extra.Emoji
                        });
                        Console.WriteLine($"  ✅ Extra eklendi: {extra.Emoji} {extra.Title}");
                    }
                }

                await _context.SaveChangesAsync();
                Console.WriteLine($"✅ Tour ID {id} güncellendi");

                var response = new TourResponseDto
                {
                    Id = tour.Id,
                    Title = tour.Title,
                    Price = tour.Price,
                    Capacity = tour.Capacity,
                    IsActive = tour.IsActive
                };

                return Ok(ApiResponseDto<TourResponseDto>.SuccessResponse(response, "Tour updated successfully"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Update Error: {ex.Message}");
                return BadRequest(ApiResponseDto<TourResponseDto>.ErrorResponse($"Error updating tour: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            try
            {
                var tour = await _context.Tours.FindAsync(id);
                if (tour == null)
                    return NotFound(ApiResponseDto<bool>.ErrorResponse("Tur bulunamadı"));

                // Dosyaları fiziksel olarak sil
                if (!string.IsNullOrEmpty(tour.MainImage))
                {
                    DeleteFile(tour.MainImage);
                }
                if (!string.IsNullOrEmpty(tour.Thumbnail))
                {
                    DeleteFile(tour.Thumbnail);
                }

                // Soft delete
                tour.IsDeleted = true;
                tour.UpdatedDate = DateTime.Now;
                
                var result = await _context.SaveChangesAsync();
                Console.WriteLine($"[DELETE] Tour ID {id}: SaveChangesAsync returned {result}");

                return Ok(ApiResponseDto<bool>.SuccessResponse(true, "Tur başarıyla silindi"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DELETE ERROR] Tour ID {id}: {ex.Message}");
                return BadRequest(ApiResponseDto<bool>.ErrorResponse($"Tur silinirken hata oluştu: {ex.Message}"));
            }
        }

        
        [HttpGet("by-category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var tours = await _context.Tours
                .Include(t => t.Guide)
                .Include(t => t.TourTranslations)
                .Where(t => !t.IsDeleted && 
                            t.IsActive && 
                            t.TourCategories.Any(tc => tc.CategoryId == categoryId))
                .Select(t => new TourListDto
                {
                    Id = t.Id,
                    Price = t.Price,
                    Currency = t.Currency,
                    Capacity = t.Capacity,
                    MainImage = t.MainImage,
                    Thumbnail = t.Thumbnail,
                    IsActive = t.IsActive,
                    GuideName = t.Guide != null ? t.Guide.Name : null,
                    Title = t.TourTranslations.FirstOrDefault() != null 
                        ? t.TourTranslations.FirstOrDefault()!.Title 
                        : null
                })
                .ToListAsync();

            return Ok(tours);
        }

        [HttpPost("{tourId}/categories/{categoryId}")]
        public async Task<IActionResult> AddCategory(int tourId, int categoryId)
        {
            var tourCategory = new TourCategory
            {
                TourId = tourId,
                CategoryId = categoryId
            };

            _context.TourCategories.Add(tourCategory);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{tourId}/categories/{categoryId}")]
        public async Task<IActionResult> RemoveCategory(int tourId, int categoryId)
        {
            var tourCategory = await _context.TourCategories
                .FirstOrDefaultAsync(tc => tc.TourId == tourId && tc.CategoryId == categoryId);

            if (tourCategory == null) return NotFound();

            _context.TourCategories.Remove(tourCategory);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("image/{fileName}")]
        [AllowAnonymous]
        public IActionResult GetImage(string fileName)
        {
            try
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "tours", fileName);
                
                if (!System.IO.File.Exists(filePath))
                    return NotFound();

                var fileStream = System.IO.File.OpenRead(filePath);
                var contentType = GetContentType(filePath);
                return File(fileStream, contentType);
            }
            catch
            {
                return NotFound();
            }
        }

        private string GetContentType(string filePath)
        {
            var ext = Path.GetExtension(filePath).ToLowerInvariant();
            return ext switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };
        }

        private async Task<string?> SaveFileAsync(IFormFile? file)
        {
            if (file == null || file.Length == 0)
            {
                Console.WriteLine("[SAVE FILE] Dosya null veya boş");
                return null;
            }

            try
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "tours");
                Console.WriteLine($"[SAVE FILE] Upload klasörü: {uploadsFolder}");
                
                Directory.CreateDirectory(uploadsFolder);
                Console.WriteLine($"[SAVE FILE] Klasör oluşturuldu/kontrol edildi");

                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);
                Console.WriteLine($"[SAVE FILE] Dosya yolu: {filePath}");

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                
                Console.WriteLine($"[SAVE FILE] ✅ Dosya başarıyla kaydedildi: {fileName}");

                // Sadece dosya adını dön - GetImage endpoint /api/tours/image/{fileName} formatında çalışıyor
                return fileName;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SAVE FILE ERROR] ❌ Hata: {ex.Message}");
                return null;
            }
        }

        private void DeleteFile(string fileName)
        {
            try
            {
                // Eski formatı temizle (/uploads/tours/ varsa kaldır)
                var cleanFileName = fileName.Replace("/uploads/tours/", "");
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "tours", cleanFileName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    Console.WriteLine($"[DELETE FILE] ✅ Dosya silindi: {cleanFileName}");
                }
                else
                {
                    Console.WriteLine($"[DELETE FILE] ⚠️ Dosya bulunamadı: {filePath}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DELETE FILE ERROR] ❌ Hata: {ex.Message}");
            }
        }

    }
}
