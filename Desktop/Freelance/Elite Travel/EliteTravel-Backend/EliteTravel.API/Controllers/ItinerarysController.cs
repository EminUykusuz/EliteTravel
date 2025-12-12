using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.Entities;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Services;
using System.Threading.Tasks;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItinerariesController : ControllerBase
    {
        private readonly IService<Itinerary, ItineraryDto> _service;

        public ItinerariesController(IService<Itinerary, ItineraryDto> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) => Ok(await _service.GetByIdAsync(id));

        [HttpPost]
        public async Task<IActionResult> Save(ItineraryDto dto)
        {
            var result = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ItineraryDto dto)
        {
            await _service.UpdateAsync(dto, id);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            await _service.RemoveAsync(id);
            return NoContent();
        }
    }
}