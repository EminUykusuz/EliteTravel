using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.DTOs;


namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItinerariesController : ControllerBase
    {
        [HttpGet("tour/{tourId}")]
        public async Task<ActionResult<List<ItineraryResponseDto>>> GetByTourId(int tourId)
        {
            return Ok(new List<ItineraryResponseDto>());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<ItineraryResponseDto>>> GetById(int id)
        {
            return Ok(ApiResponseDto<ItineraryResponseDto>.SuccessResponse(null, "Itinerary found"));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<ItineraryResponseDto>>> Create([FromBody] CreateItineraryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<ItineraryResponseDto>.ErrorResponse("Validation failed"));

            return CreatedAtAction(nameof(GetById), new { id = 1 },
                ApiResponseDto<ItineraryResponseDto>.SuccessResponse(null, "Itinerary created"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<ItineraryResponseDto>>> Update(int id, [FromBody] UpdateItineraryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<ItineraryResponseDto>.ErrorResponse("Validation failed"));

            if (id != dto.Id)
                return BadRequest(ApiResponseDto<ItineraryResponseDto>.ErrorResponse("ID mismatch"));

            return Ok(ApiResponseDto<ItineraryResponseDto>.SuccessResponse(null, "Itinerary updated"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            return Ok(ApiResponseDto<bool>.SuccessResponse(true, "Itinerary deleted"));
        }
    }
}