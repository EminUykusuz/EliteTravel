using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.Entities;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Services;
using System.Threading.Tasks;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuidesController : ControllerBase
    {
        // Buradaki tip farkına dikkat et: IService<Guide, GuideDto>
        private readonly IService<Guide, GuideDto> _service;

        // Constructor ismi sınıf ismiyle aynı olmalı: GuidesController
        public GuidesController(IService<Guide, GuideDto> service)
        {
            _service = service;
        }

        // Tüm rehberleri getir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Tek satırda yazımı (Lambda expression):
            return Ok(await _service.GetAllAsync());
        }

        // ID'ye göre rehber getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _service.GetByIdAsync(id));
        }

        // Yeni rehber ekle
        [HttpPost]
        public async Task<IActionResult> Save(GuideDto guideDto)
        {
            var newGuide = await _service.AddAsync(guideDto);
            return CreatedAtAction(nameof(GetById), new { id = newGuide.Id }, newGuide);
        }

        // Rehber güncelle
        // DİKKAT: [HttpPut("{id}")] yazmazsan ID url'den gelmez, hata alırsın.
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] GuideDto guideDto)
        {
            // ID'yi parametre olarak gönderiyoruz ki yanlış kayıt güncellenmesin.
            await _service.UpdateAsync(guideDto, id);
            return NoContent();
        }

        // Rehber sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            await _service.RemoveAsync(id);
            return NoContent();
        }
    }
}