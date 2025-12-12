using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.Entities;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Services;
using System.Threading.Tasks;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // HATA NEDENİ: Burada IService<Booking, BookingDto> kalmış olabilir. 
        // DOĞRUSU: IService<User, UserDto> olmalı.
        private readonly IService<User, UserDto> _service;

        // HATA NEDENİ: Constructor adı "BookingsController" kalmış olabilir.
        // DOĞRUSU: Sınıf adı ile aynı, yani "UsersController" olmalı.
        public UsersController(IService<User, UserDto> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _service.GetByIdAsync(id));
        }

        [HttpPost]
        public async Task<IActionResult> Save(UserDto dto)
        {
            var result = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UserDto dto)
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