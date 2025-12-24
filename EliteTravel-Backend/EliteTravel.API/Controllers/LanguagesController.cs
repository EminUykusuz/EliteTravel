using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Services;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LanguagesController : ControllerBase
    {
        private readonly ILanguageService _languageService;

        public LanguagesController(ILanguageService languageService)
        {
            _languageService = languageService;
        }

        [HttpGet]
        public async Task<ActionResult<List<LanguageResponseDto>>> GetAll()
        {
            var languages = await _languageService.GetAllLanguagesAsync();
            return Ok(languages);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<LanguageResponseDto>>> GetById(int id)
        {
            var language = await _languageService.GetLanguageByIdAsync(id);

            if (language == null)
                return NotFound(ApiResponseDto<LanguageResponseDto>.ErrorResponse("Language not found"));

            return Ok(ApiResponseDto<LanguageResponseDto>.SuccessResponse(language, "Language found"));
        }

        [HttpGet("code/{code}")]
        public async Task<ActionResult<ApiResponseDto<LanguageResponseDto>>> GetByCode(string code)
        {
            var language = await _languageService.GetByCodeAsync(code);

            if (language == null)
                return NotFound(ApiResponseDto<LanguageResponseDto>.ErrorResponse("Language not found"));

            return Ok(ApiResponseDto<LanguageResponseDto>.SuccessResponse(language, "Language found"));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<LanguageResponseDto>>> Create([FromBody] CreateLanguageDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<LanguageResponseDto>.ErrorResponse("Validation failed"));

            var createdLanguage = await _languageService.CreateLanguageAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = createdLanguage.Id },
                ApiResponseDto<LanguageResponseDto>.SuccessResponse(createdLanguage, "Language created"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<LanguageResponseDto>>> Update(int id, [FromBody] UpdateLanguageDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<LanguageResponseDto>.ErrorResponse("Validation failed"));

            if (id != dto.Id)
                return BadRequest(ApiResponseDto<LanguageResponseDto>.ErrorResponse("ID mismatch"));

            var updatedLanguage = await _languageService.UpdateLanguageAsync(dto);

            if (updatedLanguage == null)
                return NotFound(ApiResponseDto<LanguageResponseDto>.ErrorResponse("Language not found"));

            return Ok(ApiResponseDto<LanguageResponseDto>.SuccessResponse(updatedLanguage, "Language updated"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            var result = await _languageService.DeleteLanguageAsync(id);

            if (!result)
                return NotFound(ApiResponseDto<bool>.ErrorResponse("Language not found"));

            return Ok(ApiResponseDto<bool>.SuccessResponse(true, "Language deleted"));
        }
    }
}