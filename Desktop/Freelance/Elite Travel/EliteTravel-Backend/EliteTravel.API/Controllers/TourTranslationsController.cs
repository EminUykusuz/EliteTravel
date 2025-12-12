using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.Services;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourTranslationsController : ControllerBase
    {
        private readonly ITourTranslationService _service;

        public TourTranslationsController(ITourTranslationService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var values = await _service.GetAllAsync();
            return Ok(values);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var value = await _service.GetByIdAsync(id);
            if (value == null) return NotFound();
            return Ok(value);
        }

        [HttpPost]
        public async Task<IActionResult> Save(TourTranslationDto TourTranslationDto)
        {
            var newValue = await _service.AddAsync(TourTranslationDto);
            return Ok(newValue);
        }

        [HttpPut]
        public async Task<IActionResult> Update(TourTranslationDto TourTranslationDto)
        {
            await _service.UpdateAsync(TourTranslationDto, TourTranslationDto.Id);
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
