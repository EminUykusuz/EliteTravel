using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Core.Repositories;
using EliteTravel.Core.Services;
using EliteTravel.Core.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace EliteTravel.Data.Services
{
    public class TourTranslationService : ITourTranslationService
    {
        private readonly IGenericRepository<TourTranslation> _repo;
        private readonly IUnitOfWork _unitOfWork;

        public TourTranslationService(IGenericRepository<TourTranslation> repo, IUnitOfWork unitOfWork)
        {
            _repo = repo;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<TourTranslationResponseDto>> GetTranslationsByTourIdAsync(int tourId)
        {
            var translations = await _repo.Where(t => t.TourId == tourId);
            return translations.Select(t => new TourTranslationResponseDto
            {
                Id = t.Id,
                TourId = t.TourId,
                LanguageId = t.LanguageId,
                Title = t.Title,
                Description = t.Description,
                Slug = t.Slug,
                ItinerariesJson = t.ItinerariesJson,
                ExtrasJson = t.ExtrasJson,
                HighlightsJson = t.HighlightsJson,
                CreatedDate = t.CreatedDate
            }).ToList();
        }

        public async Task<TourTranslationResponseDto?> GetTranslationByIdAsync(int id)
        {
            var translation = await _repo.GetByIdAsync(id);
            if (translation == null) return null;

            return new TourTranslationResponseDto
            {
                Id = translation.Id,
                TourId = translation.TourId,
                LanguageId = translation.LanguageId,
                Title = translation.Title,
                Description = translation.Description,
                Slug = translation.Slug,
                ItinerariesJson = translation.ItinerariesJson,
                ExtrasJson = translation.ExtrasJson,
                HighlightsJson = translation.HighlightsJson,
                CreatedDate = translation.CreatedDate
            };
        }

        public async Task<TourTranslationResponseDto> CreateTranslationAsync(CreateTourTranslationDto dto)
        {
            var translation = new TourTranslation
            {
                TourId = dto.TourId,
                LanguageId = dto.LanguageId,
                Title = dto.Title,
                Description = dto.Description,
                Slug = dto.Slug,
                ItinerariesJson = dto.ItinerariesJson,
                ExtrasJson = dto.ExtrasJson,
                HighlightsJson = dto.HighlightsJson
            };

            await _repo.AddAsync(translation);
            await _unitOfWork.CommitAsync();

            return new TourTranslationResponseDto
            {
                Id = translation.Id,
                TourId = translation.TourId,
                LanguageId = translation.LanguageId,
                Title = translation.Title,
                Description = translation.Description,
                Slug = translation.Slug,
                ItinerariesJson = translation.ItinerariesJson,
                ExtrasJson = translation.ExtrasJson,
                HighlightsJson = translation.HighlightsJson,
                CreatedDate = translation.CreatedDate
            };
        }

        public async Task<TourTranslationResponseDto> UpdateTranslationAsync(UpdateTourTranslationDto dto)
        {
            var translation = await _repo.GetByIdAsync(dto.Id);
            if (translation == null)
                throw new Exception($"Translation with ID {dto.Id} not found");

            translation.Title = dto.Title;
            translation.Description = dto.Description;
            translation.Slug = dto.Slug;
            translation.ItinerariesJson = dto.ItinerariesJson;
            translation.ExtrasJson = dto.ExtrasJson;
            translation.HighlightsJson = dto.HighlightsJson;

            _repo.Update(translation);
            await _unitOfWork.CommitAsync();

            return new TourTranslationResponseDto
            {
                Id = translation.Id,
                TourId = translation.TourId,
                LanguageId = translation.LanguageId,
                Title = translation.Title,
                Description = translation.Description,
                Slug = translation.Slug,
                ItinerariesJson = translation.ItinerariesJson,
                ExtrasJson = translation.ExtrasJson,
                HighlightsJson = translation.HighlightsJson,
                CreatedDate = translation.CreatedDate
            };
        }

        public async Task<bool> DeleteTranslationAsync(int id)
        {
            var translation = await _repo.GetByIdAsync(id);
            if (translation == null) return false;

            _repo.Remove(translation);
            await _unitOfWork.CommitAsync();
            return true;
        }
    }
}
