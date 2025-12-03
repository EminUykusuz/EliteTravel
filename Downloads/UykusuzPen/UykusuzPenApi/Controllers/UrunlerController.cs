using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UykusuzPenApi.Data;
using DTOs = UykusuzPenApi.DTOs;
using M = UykusuzPenApi.Models;

namespace UykusuzPenApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UrunlerController : ControllerBase
    {
        private readonly UykusuzPenDbContext _context;
        private readonly IWebHostEnvironment _env;

        public UrunlerController(UykusuzPenDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // =================== TÜM ÜRÜNLERİ GETİR ===================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DTOs.UrunDto>>> GetAll([FromQuery] string? kategori = null)
        {
            try
            {
                var query = _context.Urunler
                    .Include(u => u.Kategori)
                    .Include(u => u.UrunRenkler).ThenInclude(ur => ur.Renk)
                    .Include(u => u.UrunResimleri)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(kategori))
                    query = query.Where(u => u.Kategori != null && u.Kategori.Slug == kategori);

                var urunler = await query.OrderByDescending(u => u.Id).ToListAsync();

                var result = urunler.Select(u => new DTOs.UrunDto
                {
                    Id = u.Id,
                    UrunAdi = u.UrunAdi,
                    Aciklama = u.Aciklama,
                    Kategori = u.Kategori != null ? new DTOs.KategoriDto
                    {
                        Id = u.Kategori.Id,
                        KategoriAdi = u.Kategori.KategoriAdi,
                        Slug = u.Kategori.Slug
                    } : null,
                    AnaResim = !string.IsNullOrEmpty(u.AnaResim)
                        ? $"{Request.Scheme}://{Request.Host}/uploads/{u.AnaResim}"
                        : null,
                    Renkler = u.UrunRenkler.Select(rr => new DTOs.RenkDto
                    {
                        Id = rr.Renk.Id,
                        RenkAdi = rr.Renk.RenkAdi
                    }).ToList(),
                    Resimler = u.UrunResimleri.Select(r => new DTOs.UrunResimDto
                    {
                        Id = r.Id,
                        ResimYolu = !string.IsNullOrEmpty(r.ResimYolu)
                            ? $"{Request.Scheme}://{Request.Host}/uploads/{r.ResimYolu}"
                            : null,
                        AltText = r.AltText
                    }).ToList()
                });

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // =================== ÜRÜN EKLE ===================
        [HttpPost]
        public async Task<ActionResult> Create([FromForm] DTOs.UrunCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, errors = ModelState });

            try
            {
                var urun = new M.Urun
{
    UrunAdi = dto.UrunAdi,
    Aciklama = dto.Aciklama,
    KategoriId = dto.KategoriId,
    Slug = string.IsNullOrWhiteSpace(dto.Slug)
        ? dto.UrunAdi.ToLower().Replace(" ", "-")
        : dto.Slug
};

                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Ana resim
                if (dto.AnaResim != null)
                {
                    var fileName = Guid.NewGuid() + Path.GetExtension(dto.AnaResim.FileName);
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                        await dto.AnaResim.CopyToAsync(stream);

                    urun.AnaResim = fileName;
                }

                _context.Urunler.Add(urun);
                await _context.SaveChangesAsync();

                // Renkleri ekle
                if (dto.RenkIds != null)
                {
                    foreach (var renkId in dto.RenkIds)
                        _context.UrunRenkler.Add(new M.UrunRenk { UrunId = urun.Id, RenkId = renkId });
                }

                // Diğer resimler
                if (dto.DigerResimler != null)
                {
                    foreach (var resim in dto.DigerResimler)
                    {
                        var fileName = Guid.NewGuid() + Path.GetExtension(resim.FileName);
                        var filePath = Path.Combine(uploadsFolder, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                            await resim.CopyToAsync(stream);

                        _context.UrunResimleri.Add(new M.UrunResim
                        {
                            UrunId = urun.Id,
                            ResimYolu = fileName,
                            AltText = $"{urun.UrunAdi} resmi"
                        });
                    }
                }

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAll), new { id = urun.Id },
                    new { success = true, message = "Ürün başarıyla eklendi", data = urun.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // =================== ÜRÜN GÜNCELLE ===================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUrun(int id, [FromForm] DTOs.UrunCreateDto dto)
        {
            var urun = await _context.Urunler
                .Include(u => u.UrunResimleri)
                .Include(u => u.UrunRenkler)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (urun == null)
                return NotFound(new { success = false, message = "Ürün bulunamadı" });

            urun.UrunAdi = dto.UrunAdi;
            urun.Aciklama = dto.Aciklama;
            urun.KategoriId = dto.KategoriId;
            urun.Slug = string.IsNullOrWhiteSpace(dto.Slug)
    ? dto.UrunAdi.ToLower().Replace(" ", "-")
    : dto.Slug;


            // Ana resim güncelleme
            if (dto.AnaResim != null)
            {
                var uploads = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.AnaResim.FileName);
                var path = Path.Combine(uploads, fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                    await dto.AnaResim.CopyToAsync(stream);

                urun.AnaResim = fileName;
            }

            // Renkleri güncelle
            _context.UrunRenkler.RemoveRange(urun.UrunRenkler);
            if (dto.RenkIds != null)
            {
                foreach (var renkId in dto.RenkIds)
                    _context.UrunRenkler.Add(new M.UrunRenk { UrunId = urun.Id, RenkId = renkId });
            }

            // Ek resimler güncelleme (opsiyonel olarak eklenebilir)
            if (dto.DigerResimler != null)
            {
                var uploads = Path.Combine(_env.WebRootPath, "uploads");
                foreach (var resim in dto.DigerResimler)
                {
                    var fileName = Guid.NewGuid() + Path.GetExtension(resim.FileName);
                    var path = Path.Combine(uploads, fileName);
                    using (var stream = new FileStream(path, FileMode.Create))
                        await resim.CopyToAsync(stream);

                    _context.UrunResimleri.Add(new M.UrunResim
                    {
                        UrunId = urun.Id,
                        ResimYolu = fileName,
                        AltText = $"{urun.UrunAdi} güncel resmi"
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Ürün güncellendi" });
        }

        // =================== TEK RESİM SİL ===================
        [HttpDelete("resim/{id}")]
        public async Task<IActionResult> DeleteResim(int id)
        {
            var resim = await _context.UrunResimleri.FindAsync(id);
            if (resim == null)
                return NotFound(new { success = false, message = "Resim bulunamadı" });

            var filePath = Path.Combine(_env.WebRootPath, "uploads", resim.ResimYolu);
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);

            _context.UrunResimleri.Remove(resim);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Resim silindi" });
        }

        // =================== ÜRÜN SİL ===================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUrun(int id)
        {
            var urun = await _context.Urunler
                .Include(u => u.UrunResimleri)
                .Include(u => u.UrunRenkler)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (urun == null)
                return NotFound(new { success = false, message = "Ürün bulunamadı" });

            // Ürüne ait resimleri sil
            foreach (var resim in urun.UrunResimleri)
            {
                var filePath = Path.Combine(_env.WebRootPath, "uploads", resim.ResimYolu);
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
            }

            _context.UrunResimleri.RemoveRange(urun.UrunResimleri);
            _context.UrunRenkler.RemoveRange(urun.UrunRenkler);
            _context.Urunler.Remove(urun);

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Ürün başarıyla silindi" });
        }

        // =================== TEST ===================
        [HttpGet("test-upload")]
        public IActionResult TestUpload()
        {
            var path = Path.Combine(_env.WebRootPath, "uploads");
            var files = Directory.Exists(path) ? Directory.GetFiles(path) : Array.Empty<string>();
            return Ok(files.Select(f => Path.GetFileName(f)));
        }
    }
}
