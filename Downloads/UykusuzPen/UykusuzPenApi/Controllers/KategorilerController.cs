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
    public class KategorilerController : ControllerBase
    {
        private readonly UykusuzPenDbContext _context;

        public KategorilerController(UykusuzPenDbContext context)
        {
            _context = context;
        }

        // GET: api/kategoriler
        [HttpGet]
        public async Task<ActionResult<IEnumerable<KategoriDto>>> GetAll()
        {
            try
            {
                // Tüm kategorileri düz liste olarak getir (frontend'de filtreleme yapacak)
                var kategoriler = await _context.Kategoriler
                    .OrderBy(k => k.KategoriAdi)
                    .Select(k => new KategoriDto
                    {
                        Id = k.Id,
                        KategoriAdi = k.KategoriAdi,
                        Slug = k.Slug,
                        Aciklama = k.Aciklama,
                        UstKategoriId = k.UstKategoriId
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = kategoriler });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // GET: api/kategoriler/hiyerarsik
        [HttpGet("hiyerarsik")]
        public async Task<ActionResult<IEnumerable<KategoriDto>>> GetHiyerarsik()
        {
            try
            {
                var kategoriler = await _context.Kategoriler
                    .Where(k => k.UstKategoriId == null) // Sadece ana kategoriler
                    .Include(k => k.AltKategoriler)
                    .OrderBy(k => k.KategoriAdi)
                    .Select(k => new KategoriDto
                    {
                        Id = k.Id,
                        KategoriAdi = k.KategoriAdi,
                        Slug = k.Slug,
                        Aciklama = k.Aciklama,
                        UstKategoriId = k.UstKategoriId,
                        AltKategoriler = k.AltKategoriler.Select(ak => new KategoriDto
                        {
                            Id = ak.Id,
                            KategoriAdi = ak.KategoriAdi,
                            Slug = ak.Slug,
                            Aciklama = ak.Aciklama,
                            UstKategoriId = ak.UstKategoriId
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = kategoriler });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // GET: api/kategoriler/slug
        [HttpGet("{slug}")]
        public async Task<ActionResult<KategoriDto>> GetBySlug(string slug)
        {
            try
            {
                var kategori = await _context.Kategoriler
                    .Include(k => k.AltKategoriler)
                    .FirstOrDefaultAsync(k => k.Slug == slug);

                if (kategori == null)
                    return NotFound(new { success = false, message = "Kategori bulunamadı" });

                var dto = new KategoriDto
                {
                    Id = kategori.Id,
                    KategoriAdi = kategori.KategoriAdi,
                    Slug = kategori.Slug,
                    Aciklama = kategori.Aciklama,
                    UstKategoriId = kategori.UstKategoriId,
                    AltKategoriler = kategori.AltKategoriler.Select(ak => new KategoriDto
                    {
                        Id = ak.Id,
                        KategoriAdi = ak.KategoriAdi,
                        Slug = ak.Slug,
                        Aciklama = ak.Aciklama,
                        UstKategoriId = ak.UstKategoriId
                    }).ToList()
                };

                return Ok(new { success = true, data = dto });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // POST: api/kategoriler
        [HttpPost]
        public async Task<ActionResult<KategoriDto>> Create([FromBody] KategoriCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, errors = ModelState });

            try
            {
                var kategori = new UykusuzPenApi.Models.Kategori
                {
                    KategoriAdi = dto.KategoriAdi,
                    Slug = dto.Slug,
                    Aciklama = dto.Aciklama,
                    UstKategoriId = dto.UstKategoriId
                };

                _context.Kategoriler.Add(kategori);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBySlug), new { slug = kategori.Slug },
                    new { success = true, message = "Kategori başarıyla eklendi", data = kategori.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // DELETE: api/kategoriler/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var kategori = await _context.Kategoriler.FindAsync(id);
                if (kategori == null)
                    return NotFound(new { success = false, message = "Kategori bulunamadı" });

                // Kategori ürünlerde kullanılıyor mu kontrol et
                var kullanimdaMi = await _context.Urunler
                    .AnyAsync(u => u.KategoriId == id);
                    
                if (kullanimdaMi)
                    return BadRequest(new { success = false, message = "Bu kategori ürünlerde kullanıldığı için silinemez" });

                // Kategoriye bağlı renkler var mı kontrol et
                var renklerVar = await _context.Renkler
                    .AnyAsync(r => r.KategoriId == id);
                    
                if (renklerVar)
                    return BadRequest(new { success = false, message = "Bu kategoriye bağlı renkler var, önce renkleri silin veya başka kategoriye taşıyın" });

                _context.Kategoriler.Remove(kategori);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Kategori başarıyla silindi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}