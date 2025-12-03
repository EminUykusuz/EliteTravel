using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UykusuzPenApi.Data;
using UykusuzPenApi.DTOs;
using UykusuzPenApi.Models;
using UykusuzPenApi.Services.Interfaces;
using System.ComponentModel.DataAnnotations;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace UykusuzPenApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RenklerController : ControllerBase
    {
        private readonly UykusuzPenDbContext _context;

        public RenklerController(UykusuzPenDbContext context)
        {
            _context = context;
        }

        // GET: api/renkler
        // GET: api/renkler?kategoriId=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RenkDto>>> GetAll([FromQuery] int? kategoriId)
        {
            try
            {
                var query = _context.Renkler.AsQueryable();

                // Eğer kategoriId parametresi gönderildiyse filtrele
                if (kategoriId.HasValue)
                {
                    query = query.Where(r => r.KategoriId == kategoriId.Value);
                }

                var renkler = await query
                    .OrderBy(r => r.RenkAdi)
                    .Select(r => new RenkDto 
                    { 
                        Id = r.Id, 
                        RenkAdi = r.RenkAdi,
                        KategoriId = r.KategoriId
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = renkler });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // GET: api/renkler/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RenkDto>> GetById(int id)
        {
            try
            {
                var renk = await _context.Renkler.FindAsync(id);
                if (renk == null)
                    return NotFound(new { success = false, message = "Renk bulunamadı" });

                var dto = new RenkDto 
                { 
                    Id = renk.Id, 
                    RenkAdi = renk.RenkAdi,
                    KategoriId = renk.KategoriId
                };
                return Ok(new { success = true, data = dto });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // POST: api/renkler
        [HttpPost]
        public async Task<ActionResult<RenkDto>> Create([FromBody] RenkCreateDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.RenkAdi))
                    return BadRequest(new { success = false, message = "Renk adı zorunludur" });

                // Eğer kategori ID'si verilmişse, kategorinin var olduğunu kontrol et
                if (dto.KategoriId.HasValue)
                {
                    var kategoriExists = await _context.Kategoriler
                        .AnyAsync(k => k.Id == dto.KategoriId.Value);
                    
                    if (!kategoriExists)
                        return BadRequest(new { success = false, message = "Geçersiz kategori ID" });
                }

                var renk = new Renk
                {
                    RenkAdi = dto.RenkAdi,
                    KategoriId = dto.KategoriId
                };

                _context.Renkler.Add(renk);
                await _context.SaveChangesAsync();

                var result = new RenkDto
                {
                    Id = renk.Id,
                    RenkAdi = renk.RenkAdi,
                    KategoriId = renk.KategoriId
                };

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // PUT: api/renkler/5
        [HttpPut("{id}")]
        public async Task<ActionResult<RenkDto>> Update(int id, [FromBody] RenkCreateDto dto)
        {
            try
            {
                var renk = await _context.Renkler.FindAsync(id);
                if (renk == null)
                    return NotFound(new { success = false, message = "Renk bulunamadı" });

                if (string.IsNullOrWhiteSpace(dto.RenkAdi))
                    return BadRequest(new { success = false, message = "Renk adı zorunludur" });

                // Eğer kategori ID'si verilmişse, kategorinin var olduğunu kontrol et
                if (dto.KategoriId.HasValue)
                {
                    var kategoriExists = await _context.Kategoriler
                        .AnyAsync(k => k.Id == dto.KategoriId.Value);
                    
                    if (!kategoriExists)
                        return BadRequest(new { success = false, message = "Geçersiz kategori ID" });
                }

                renk.RenkAdi = dto.RenkAdi;
                renk.KategoriId = dto.KategoriId;

                await _context.SaveChangesAsync();

                var result = new RenkDto
                {
                    Id = renk.Id,
                    RenkAdi = renk.RenkAdi,
                    KategoriId = renk.KategoriId
                };

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // DELETE: api/renkler/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var renk = await _context.Renkler.FindAsync(id);
                if (renk == null)
                    return NotFound(new { success = false, message = "Renk bulunamadı" });

                // Renk kullanılıyor mu kontrol et
                var kullanimdaMi = await _context.UrunRenkler
                    .AnyAsync(ur => ur.RenkId == id);

                if (kullanimdaMi)
                    return BadRequest(new { success = false, message = "Bu renk ürünlerde kullanıldığı için silinemez" });

                _context.Renkler.Remove(renk);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Renk başarıyla silindi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}