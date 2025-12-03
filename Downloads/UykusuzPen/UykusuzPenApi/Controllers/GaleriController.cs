// Controllers/GaleriController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UykusuzPenApi.Data;
using UykusuzPenApi.DTOs;
using UykusuzPenApi.Models;

namespace UykusuzPenApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GaleriController : ControllerBase
    {
        private readonly UykusuzPenDbContext _context;

        public GaleriController(UykusuzPenDbContext context)
        {
            _context = context;
        }

        // Slug oluşturucu
        private string GenerateSlug(string text)
        {
            string slug = text.ToLower()
                .Replace(" ", "-")
                .Replace("ğ", "g")
                .Replace("ü", "u")
                .Replace("ş", "s")
                .Replace("ı", "i")
                .Replace("ö", "o")
                .Replace("ç", "c");

            return slug;
        }

        // GET: api/galeri
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GaleriDto>>> GetAll(
            [FromQuery] string? kategori = null,
            [FromQuery] string? il = null,
            [FromQuery] string? medyaTipi = null)
        {
            try
            {
                var query = _context.Galeri.Include(g => g.Kategori).AsQueryable();

                if (!string.IsNullOrEmpty(kategori))
                    query = query.Where(g => g.Kategori != null && g.Kategori.Slug == kategori);

                if (!string.IsNullOrEmpty(il))
                    query = query.Where(g => g.Il == il);

                if (!string.IsNullOrEmpty(medyaTipi))
                    query = query.Where(g => g.MedyaTipi == medyaTipi);

                var galeriler = await query.OrderByDescending(g => g.Id).ToListAsync();

                var result = galeriler.Select(g => new GaleriDto
                {
                    Id = g.Id,
                    Baslik = g.Baslik,
                    Slug = g.Slug,
                    Aciklama = g.Aciklama,
                    Kategori = g.Kategori != null ? new KategoriDto
                    {
                        Id = g.Kategori.Id,
                        KategoriAdi = g.Kategori.KategoriAdi,
                        Slug = g.Kategori.Slug
                    } : null,
                    Il = g.Il,
                    Ilce = g.Ilce,
                    MedyaTipi = g.MedyaTipi,
                    MedyaYolu = g.MedyaYolu,
                    KapakResmi = g.KapakResmi,
                    AltText = g.AltText
                });

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // GET: api/galeri/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GaleriDto>> GetById(int id)
        {
            try
            {
                var galeri = await _context.Galeri
                    .Include(g => g.Kategori)
                    .FirstOrDefaultAsync(g => g.Id == id);

                if (galeri == null)
                    return NotFound(new { success = false, message = "Galeri öğesi bulunamadı" });

                var result = new GaleriDto
                {
                    Id = galeri.Id,
                    Baslik = galeri.Baslik,
                    Slug = galeri.Slug,
                    Aciklama = galeri.Aciklama,
                    Kategori = galeri.Kategori != null ? new KategoriDto
                    {
                        Id = galeri.Kategori.Id,
                        KategoriAdi = galeri.Kategori.KategoriAdi,
                        Slug = galeri.Kategori.Slug
                    } : null,
                    Il = galeri.Il,
                    Ilce = galeri.Ilce,
                    MedyaTipi = galeri.MedyaTipi,
                    MedyaYolu = galeri.MedyaYolu,
                    KapakResmi = galeri.KapakResmi,
                    AltText = galeri.AltText
                };

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // GET: api/galeri/slug/{slug}
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<GaleriDto>> GetBySlug(string slug)
        {
            try
            {
                var galeri = await _context.Galeri
                    .Include(g => g.Kategori)
                    .FirstOrDefaultAsync(g => g.Slug == slug);

                if (galeri == null)
                    return NotFound(new { success = false, message = "Galeri öğesi bulunamadı" });

                var result = new GaleriDto
                {
                    Id = galeri.Id,
                    Baslik = galeri.Baslik,
                    Slug = galeri.Slug,
                    Aciklama = galeri.Aciklama,
                    Kategori = galeri.Kategori != null ? new KategoriDto
                    {
                        Id = galeri.Kategori.Id,
                        KategoriAdi = galeri.Kategori.KategoriAdi,
                        Slug = galeri.Kategori.Slug
                    } : null,
                    Il = galeri.Il,
                    Ilce = galeri.Ilce,
                    MedyaTipi = galeri.MedyaTipi,
                    MedyaYolu = galeri.MedyaYolu,
                    KapakResmi = galeri.KapakResmi,
                    AltText = galeri.AltText
                };

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // POST: api/galeri
        [HttpPost]
        public async Task<ActionResult<GaleriDto>> Create([FromForm] GaleriCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, errors = ModelState });

            try
            {
                string medyaYolu = "";
                string? kapakResmi = null;

                // Medya dosyası kaydet
                if (dto.MedyaDosyasi != null)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "galeri");
                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);

                    var uniqueFileName = Guid.NewGuid() + "_" + dto.MedyaDosyasi.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using var fileStream = new FileStream(filePath, FileMode.Create);
                    await dto.MedyaDosyasi.CopyToAsync(fileStream);

                    medyaYolu = "/uploads/galeri/" + uniqueFileName;
                }

                // Kapak resmi kaydet
                if (dto.KapakResmi != null)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "galeri");
                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);

                    var uniqueFileName = Guid.NewGuid() + "_" + dto.KapakResmi.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using var fileStream = new FileStream(filePath, FileMode.Create);
                    await dto.KapakResmi.CopyToAsync(fileStream);

                    kapakResmi = "/uploads/galeri/" + uniqueFileName;
                }

                var galeri = new Galeri
                {
                    Baslik = dto.Baslik,
                    Slug = GenerateSlug(dto.Baslik), // <-- Slug oluştur
                    Aciklama = dto.Aciklama,
                    KategoriId = dto.KategoriId,
                    Il = dto.Il,
                    Ilce = dto.Ilce,
                    MedyaTipi = dto.MedyaTipi,
                    MedyaYolu = medyaYolu,
                    KapakResmi = kapakResmi,
                    AltText = dto.AltText
                };

                _context.Galeri.Add(galeri);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = galeri.Id },
                    new { success = true, message = "Galeri öğesi başarıyla eklendi", data = galeri.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // PUT: api/galeri/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromForm] GaleriUpdateDto dto)
        {
            try
            {
                var galeri = await _context.Galeri.FindAsync(id);
                if (galeri == null)
                    return NotFound(new { success = false, message = "Galeri öğesi bulunamadı" });

                if (dto.MedyaDosyasi != null)
                    galeri.MedyaYolu = dto.MedyaDosyasi.FileName;

                if (dto.KapakResmi != null)
                    galeri.KapakResmi = dto.KapakResmi.FileName;

                galeri.Baslik = dto.Baslik ?? galeri.Baslik;
                galeri.Slug = dto.Baslik != null ? GenerateSlug(dto.Baslik) : galeri.Slug; // Güncelle slug
                galeri.Aciklama = dto.Aciklama ?? galeri.Aciklama;
                galeri.KategoriId = dto.KategoriId ?? galeri.KategoriId;
                galeri.Il = dto.Il ?? galeri.Il;
                galeri.Ilce = dto.Ilce ?? galeri.Ilce;
                galeri.MedyaTipi = dto.MedyaTipi ?? galeri.MedyaTipi;
                galeri.AltText = dto.AltText ?? galeri.AltText;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Galeri öğesi güncellendi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // DELETE: api/galeri/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var galeri = await _context.Galeri.FindAsync(id);
                if (galeri == null)
                    return NotFound(new { success = false, message = "Galeri öğesi bulunamadı" });

                _context.Galeri.Remove(galeri);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Galeri öğesi silindi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
