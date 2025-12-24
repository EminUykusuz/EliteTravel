using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Services;


namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourTranslationsController : ControllerBase
    {
        private readonly ITourTranslationService _tourTranslationService;

        public TourTranslationsController(ITourTranslationService tourTranslationService)
        {
            _tourTranslationService = tourTranslationService;
        }

        [HttpGet("tour/{tourId}")]
        public async Task<ActionResult<List<TourTranslationResponseDto>>> GetByTourId(int tourId)
        {
            var translations = await _tourTranslationService.GetTranslationsByTourIdAsync(tourId);
            return Ok(translations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<TourTranslationResponseDto>>> GetById(int id)
        {
            var translation = await _tourTranslationService.GetTranslationByIdAsync(id);
            
            if (translation == null)
                return NotFound(ApiResponseDto<TourTranslationResponseDto>.ErrorResponse("Translation not found"));

            return Ok(ApiResponseDto<TourTranslationResponseDto>.SuccessResponse(translation, "Translation found"));
        }

        [HttpGet("tour/{tourId}/language/{languageId}")]
        public async Task<ActionResult<ApiResponseDto<TourTranslationResponseDto>>> GetByTourAndLanguage(
            int tourId, 
            int languageId)
        {
            var translations = await _tourTranslationService.GetTranslationsByTourIdAsync(tourId);
            var translation = translations.FirstOrDefault(t => t.LanguageId == languageId);

            if (translation == null)
                return NotFound(ApiResponseDto<TourTranslationResponseDto>.ErrorResponse("Translation not found"));

            return Ok(ApiResponseDto<TourTranslationResponseDto>.SuccessResponse(translation, "Translation found"));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<TourTranslationResponseDto>>> Create([FromBody] CreateTourTranslationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<TourTranslationResponseDto>.ErrorResponse("Validation failed"));

            var createdTranslation = await _tourTranslationService.CreateTranslationAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = createdTranslation.Id },
                ApiResponseDto<TourTranslationResponseDto>.SuccessResponse(createdTranslation, "Translation created"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<TourTranslationResponseDto>>> Update(int id, [FromBody] UpdateTourTranslationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<TourTranslationResponseDto>.ErrorResponse("Validation failed"));

            if (id != dto.Id)
                return BadRequest(ApiResponseDto<TourTranslationResponseDto>.ErrorResponse("ID mismatch"));

            var updatedTranslation = await _tourTranslationService.UpdateTranslationAsync(dto);

            if (updatedTranslation == null)
                return NotFound(ApiResponseDto<TourTranslationResponseDto>.ErrorResponse("Translation not found"));

            return Ok(ApiResponseDto<TourTranslationResponseDto>.SuccessResponse(updatedTranslation, "Translation updated"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            var result = await _tourTranslationService.DeleteTranslationAsync(id);

            if (!result)
                return NotFound(ApiResponseDto<bool>.ErrorResponse("Translation not found"));

            return Ok(ApiResponseDto<bool>.SuccessResponse(true, "Translation deleted"));
        }
    }
}