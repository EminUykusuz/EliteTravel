using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.DTOs;


namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PageSeosController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<PageSeoResponseDto>>> GetAll()
        {
            return Ok(new List<PageSeoResponseDto>());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<PageSeoResponseDto>>> GetById(int id)
        {
            return Ok(ApiResponseDto<PageSeoResponseDto>.SuccessResponse(null, "Page SEO found"));
        }

        [HttpGet("key/{pageKey}")]
        public async Task<ActionResult<ApiResponseDto<PageSeoResponseDto>>> GetByPageKey(string pageKey)
        {
            return Ok(ApiResponseDto<PageSeoResponseDto>.SuccessResponse(null, "Page SEO found"));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<PageSeoResponseDto>>> Create([FromBody] CreatePageSeoDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<PageSeoResponseDto>.ErrorResponse("Validation failed"));

            return CreatedAtAction(nameof(GetById), new { id = 1 },
                ApiResponseDto<PageSeoResponseDto>.SuccessResponse(null, "Page SEO created"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<PageSeoResponseDto>>> Update(int id, [FromBody] UpdatePageSeoDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<PageSeoResponseDto>.ErrorResponse("Validation failed"));

            if (id != dto.Id)
                return BadRequest(ApiResponseDto<PageSeoResponseDto>.ErrorResponse("ID mismatch"));

            return Ok(ApiResponseDto<PageSeoResponseDto>.SuccessResponse(null, "Page SEO updated"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            return Ok(ApiResponseDto<bool>.SuccessResponse(true, "Page SEO deleted"));
        }
    }
}