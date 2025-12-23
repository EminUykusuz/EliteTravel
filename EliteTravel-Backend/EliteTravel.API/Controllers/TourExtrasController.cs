using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.DTOs;


namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourExtrasController : ControllerBase
    {
        [HttpGet("tour/{tourId}")]
        public async Task<ActionResult<List<TourExtraResponseDto>>> GetByTourId(int tourId)
        {
            return Ok(new List<TourExtraResponseDto>());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<TourExtraResponseDto>>> GetById(int id)
        {
            return Ok(ApiResponseDto<TourExtraResponseDto>.SuccessResponse(null, "Extra found"));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<TourExtraResponseDto>>> Create([FromBody] CreateTourExtraDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<TourExtraResponseDto>.ErrorResponse("Validation failed"));

            return CreatedAtAction(nameof(GetById), new { id = 1 },
                ApiResponseDto<TourExtraResponseDto>.SuccessResponse(null, "Extra created"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<TourExtraResponseDto>>> Update(int id, [FromBody] UpdateTourExtraDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<TourExtraResponseDto>.ErrorResponse("Validation failed"));

            if (id != dto.Id)
                return BadRequest(ApiResponseDto<TourExtraResponseDto>.ErrorResponse("ID mismatch"));

            return Ok(ApiResponseDto<TourExtraResponseDto>.SuccessResponse(null, "Extra updated"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            return Ok(ApiResponseDto<bool>.SuccessResponse(true, "Extra deleted"));
        }
    }
}