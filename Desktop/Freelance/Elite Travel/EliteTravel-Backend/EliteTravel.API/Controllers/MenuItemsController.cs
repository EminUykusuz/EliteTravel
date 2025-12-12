using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.Entities;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Services;
using System.Threading.Tasks;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemsController : ControllerBase
    {
        private readonly IService<MenuItem, MenuItemDto> _service;

        public MenuItemsController(IService<MenuItem, MenuItemDto> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) => Ok(await _service.GetByIdAsync(id));

        [HttpPost]
        public async Task<IActionResult> Save(MenuItemDto dto)
        {
            var result = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MenuItemDto dto)
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