using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.DTOs;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LanguagesController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<LanguageResponseDto>>> GetAll()
        {
            // Genelde çok az dil olur, pagination gereksiz
            return Ok(new List<LanguageResponseDto>());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<LanguageResponseDto>>> GetById(int id)
        {
            return Ok(ApiResponseDto<LanguageResponseDto>.SuccessResponse(null, "Language found"));
        }

        [HttpGet("code/{code}")]
        public async Task<ActionResult<ApiResponseDto<LanguageResponseDto>>> GetByCode(string code)
        {
            return Ok(ApiResponseDto<LanguageResponseDto>.SuccessResponse(null, "Language found"));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<LanguageResponseDto>>> Create([FromBody] CreateLanguageDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<LanguageResponseDto>.ErrorResponse("Validation failed"));

            return CreatedAtAction(nameof(GetById), new { id = 1 },
                ApiResponseDto<LanguageResponseDto>.SuccessResponse(null, "Language created"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<LanguageResponseDto>>> Update(int id, [FromBody] UpdateLanguageDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<LanguageResponseDto>.ErrorResponse("Validation failed"));

            if (id != dto.Id)
                return BadRequest(ApiResponseDto<LanguageResponseDto>.ErrorResponse("ID mismatch"));

            return Ok(ApiResponseDto<LanguageResponseDto>.SuccessResponse(null, "Language updated"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            return Ok(ApiResponseDto<bool>.SuccessResponse(true, "Language deleted"));
        }
    }
}