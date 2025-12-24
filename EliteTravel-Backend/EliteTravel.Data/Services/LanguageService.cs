using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Core.Repositories;
using EliteTravel.Core.Services;
using EliteTravel.Core.UnitOfWork;

namespace EliteTravel.Data.Services
{
    public class LanguageService : ILanguageService
    {
        private readonly IGenericRepository<Language> _repo;
        private readonly IUnitOfWork _unitOfWork;

        public LanguageService(IGenericRepository<Language> repo, IUnitOfWork unitOfWork)
        {
            _repo = repo;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<LanguageResponseDto>> GetAllLanguagesAsync()
        {
            var languages = await _repo.GetAllAsync();
            return languages.Select(l => new LanguageResponseDto
            {
                Id = l.Id,
                Code = l.Code,
                Name = l.Name,
                Icon = l.Icon,
                CreatedDate = l.CreatedDate
            }).ToList();
        }

        public async Task<LanguageResponseDto?> GetLanguageByIdAsync(int id)
        {
            var language = await _repo.GetByIdAsync(id);
            if (language == null) return null;

            return new LanguageResponseDto
            {
                Id = language.Id,
                Code = language.Code,
                Name = language.Name,
                Icon = language.Icon,
                CreatedDate = language.CreatedDate
            };
        }

        public async Task<LanguageResponseDto?> GetByCodeAsync(string code)
        {
            var languages = await _repo.GetAllAsync();
            var language = languages.FirstOrDefault(l => l.Code == code);
            if (language == null) return null;

            return new LanguageResponseDto
            {
                Id = language.Id,
                Code = language.Code,
                Name = language.Name,
                Icon = language.Icon,
                CreatedDate = language.CreatedDate
            };
        }

        public async Task<LanguageResponseDto> CreateLanguageAsync(CreateLanguageDto dto)
        {
            var language = new Language
            {
                Code = dto.Code,
                Name = dto.Name,
                Icon = dto.Icon
            };

            await _repo.AddAsync(language);
            await _unitOfWork.CommitAsync();

            return new LanguageResponseDto
            {
                Id = language.Id,
                Code = language.Code,
                Name = language.Name,
                Icon = language.Icon,
                CreatedDate = language.CreatedDate
            };
        }

        public async Task<LanguageResponseDto> UpdateLanguageAsync(UpdateLanguageDto dto)
        {
            var language = await _repo.GetByIdAsync(dto.Id);
            if (language == null)
                throw new Exception($"Language with ID {dto.Id} not found");

            language.Code = dto.Code;
            language.Name = dto.Name;
            language.Icon = dto.Icon;

            _repo.Update(language);
            await _unitOfWork.CommitAsync();

            return new LanguageResponseDto
            {
                Id = language.Id,
                Code = language.Code,
                Name = language.Name,
                Icon = language.Icon,
                CreatedDate = language.CreatedDate
            };
        }

        public async Task<bool> DeleteLanguageAsync(int id)
        {
            var language = await _repo.GetByIdAsync(id);
            if (language == null) return false;

            _repo.Remove(language);
            await _unitOfWork.CommitAsync();
            return true;
        }
    }
}
