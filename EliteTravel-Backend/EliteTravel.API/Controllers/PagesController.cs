using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.DTOs;


namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagesController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<PaginatedResultDto<PageResponseDto>>> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            return Ok(new PaginatedResultDto<PageResponseDto>
            {
                Items = new List<PageResponseDto>(),
                TotalCount = 0,
                PageNumber = pageNumber,
                PageSize = pageSize
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<PageResponseDto>>> GetById(int id)
        {
            return Ok(ApiResponseDto<PageResponseDto>.SuccessResponse(null, "Page found"));
        }

        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<ApiResponseDto<PageResponseDto>>> GetBySlug(string slug)
        {
            return Ok(ApiResponseDto<PageResponseDto>.SuccessResponse(null, "Page found"));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<PageResponseDto>>> Create([FromBody] CreatePageDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<PageResponseDto>.ErrorResponse("Validation failed"));

            return CreatedAtAction(nameof(GetById), new { id = 1 },
                ApiResponseDto<PageResponseDto>.SuccessResponse(null, "Page created"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<PageResponseDto>>> Update(int id, [FromBody] UpdatePageDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<PageResponseDto>.ErrorResponse("Validation failed"));

            if (id != dto.Id)
                return BadRequest(ApiResponseDto<PageResponseDto>.ErrorResponse("ID mismatch"));

            return Ok(ApiResponseDto<PageResponseDto>.SuccessResponse(null, "Page updated"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            return Ok(ApiResponseDto<bool>.SuccessResponse(true, "Page deleted"));
        }
    }
}