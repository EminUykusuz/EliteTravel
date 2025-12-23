using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.DTOs;


namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourTranslationsController : ControllerBase
    {
        [HttpGet("tour/{tourId}")]
        public async Task<ActionResult<List<TourTranslationResponseDto>>> GetByTourId(int tourId)
        {
            return Ok(new List<TourTranslationResponseDto>());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<TourTranslationResponseDto>>> GetById(int id)
        {
            return Ok(ApiResponseDto<TourTranslationResponseDto>.SuccessResponse(null, "Translation found"));
        }

        [HttpGet("tour/{tourId}/language/{languageId}")]
        public async Task<ActionResult<ApiResponseDto<TourTranslationResponseDto>>> GetByTourAndLanguage(
            int tourId, 
            int languageId)
        {
            return Ok(ApiResponseDto<TourTranslationResponseDto>.SuccessResponse(null, "Translation found"));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<TourTranslationResponseDto>>> Create([FromBody] CreateTourTranslationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<TourTranslationResponseDto>.ErrorResponse("Validation failed"));

            return CreatedAtAction(nameof(GetById), new { id = 1 },
                ApiResponseDto<TourTranslationResponseDto>.SuccessResponse(null, "Translation created"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<TourTranslationResponseDto>>> Update(int id, [FromBody] UpdateTourTranslationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<TourTranslationResponseDto>.ErrorResponse("Validation failed"));

            if (id != dto.Id)
                return BadRequest(ApiResponseDto<TourTranslationResponseDto>.ErrorResponse("ID mismatch"));

            return Ok(ApiResponseDto<TourTranslationResponseDto>.SuccessResponse(null, "Translation updated"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            return Ok(ApiResponseDto<bool>.SuccessResponse(true, "Translation deleted"));
        }
    }
}