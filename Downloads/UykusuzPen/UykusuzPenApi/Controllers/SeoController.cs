// --- GEREKLİ TÜM KÜTÜPHANELER ---
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using System.Threading.Tasks;
using UykusuzPenApi.Data;
using UykusuzPenApi.DTOs;
using UykusuzPenApi.Models;

namespace UykusuzPenApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeoController : ControllerBase
    {
        private readonly UykusuzPenDbContext _context;

        public SeoController(UykusuzPenDbContext context)
        {
            _context = context;
        }

        // GET: api/seo?sayfaTipi=anasayfa&sayfaId=1
        [HttpGet]
        public async Task<ActionResult<SeoDto>> GetSeoData(
            [FromQuery] string sayfaTipi, 
            [FromQuery] int? sayfaId = null)
        {
            try
            {
                var seo = await _context.SeoAyarlari
                    .FirstOrDefaultAsync(s => s.SayfaTipi == sayfaTipi && s.SayfaId == sayfaId);

                if (seo == null)
                {
                    // Kayıt yoksa varsayılanı yolla
                    return Ok(new 
                    { 
                        success = true, 
                        data = new SeoDto // Bu DTO'nun 'MetaDescription' ve 'MetaKeywords' kullandığını varsayıyoruz
                        {
                            Title = "PVC Pencere ve Kapı Sistemleri",
                            MetaDescription = "Kaliteli PVC pencere, kapı ve cam balkon sistemleri.",
                            MetaKeywords = "pvc pencere, pvc kapı, cam balkon"
                        }
                    });
                }

                // Kayıt varsa DTO'ya map'le
                var dto = new SeoDto
                {
                    Title = seo.Title,
                    MetaDescription = seo.MetaDescription, // Bu zaten doğru
                    MetaKeywords = seo.MetaKeywords      // Bu zaten doğru
                };

                return Ok(new { success = true, data = dto });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // GET: api/seo/all - Dashboard için tüm SEO ayarları
        [HttpGet("all")]
        public async Task<ActionResult> GetAllSeoData()
        {
            try
            {
                var seoList = await _context.SeoAyarlari
                    .Select(s => new
                    {
                        s.Id,
                        sayfa_tipi = s.SayfaTipi,
                        sayfa_id = s.SayfaId,
                        title = s.Title,
                        // --- DÜZELTME 1: İSİMLERİ TUTARLI HALE GETİR ---
                        metaDescription = s.MetaDescription, // 'description' -> 'metaDescription'
                        metaKeywords = s.MetaKeywords,     // 'meta_keywords' -> 'metaKeywords'
                        // --- DÜZELTME 1 SONU ---
                        aciklama = s.Aciklama
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = seoList });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // POST: api/seo - Dashboard'dan kayıt için
        [HttpPost]
        [Authorize] // Admin kontrolü için
        public async Task<ActionResult> CreateOrUpdateSeo([FromBody] SeoUpdateDto dto)
        {
            // DTO'nun 'MetaDescription' beklediğini varsayıyoruz. 
            // Eğer 'Description' bekliyorsa, 400 hatası devam eder. DTO dosyanı da kontrol et.
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, errors = ModelState });

            try
            {
                var existingSeo = await _context.SeoAyarlari
                    .FirstOrDefaultAsync(s => s.SayfaTipi == dto.SayfaTipi && s.SayfaId == dto.SayfaId);

                if (existingSeo != null)
                {
                    // Güncelle
                    existingSeo.Title = dto.Title;
                    // --- DÜZELTME 2: DTO'DAN GELEN İSİMLERİ TUTARLI HALE GETİR ---
                    existingSeo.MetaDescription = dto.MetaDescription; // 'dto.Description' -> 'dto.MetaDescription'
                    existingSeo.MetaKeywords = dto.MetaKeywords;     
                    // --- DÜZELTME 2 SONU ---
                    existingSeo.Aciklama = dto.Aciklama;
                }
                else
                {
                    // Yeni kayıt oluştur
                    var newSeo = new SeoAyari
                    {
                        SayfaTipi = dto.SayfaTipi,
                        SayfaId = dto.SayfaId,
                        Title = dto.Title,
                        // --- DÜZELTME 3: DTO'DAN GELEN İSİMLERİ TUTARLI HALE GETİR ---
                        MetaDescription = dto.MetaDescription, // 'dto.Description' -> 'dto.MetaDescription'
                        MetaKeywords = dto.MetaKeywords,     
                        // --- DÜZELTME 3 SONU ---
                        Aciklama = dto.Aciklama
                    };
                    _context.SeoAyarlari.Add(newSeo);
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "SEO ayarları kaydedildi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // DELETE: api/seo/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteSeo(int id)
        {
            try
            {
                var seo = await _context.SeoAyarlari.FindAsync(id);
                if (seo == null)
                    return NotFound(new { success = false, message = "SEO kaydı bulunamadı" });

                _context.SeoAyarlari.Remove(seo);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "SEO kaydı silindi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}