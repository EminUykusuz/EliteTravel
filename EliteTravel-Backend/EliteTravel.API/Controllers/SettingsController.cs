using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.Entities;
using EliteTravel.Data.Contexts;
using Microsoft.EntityFrameworkCore;

namespace EliteTravel.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SettingsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var settings = await _context.Settings.ToListAsync();
            return Ok(new { success = true, data = settings });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var settings = await _context.Settings.FirstOrDefaultAsync(s => s.Id == id);
            if (settings == null)
                return NotFound(new { success = false, message = "Ayarlar bulunamadı" });

            return Ok(new { success = true, data = settings });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Settings settings)
    {
        try
        {
            // Eğer zaten bir ayar varsa, yeni bir tane oluşturma
            var existing = await _context.Settings.FirstOrDefaultAsync();
            if (existing != null)
            {
                return BadRequest(new { success = false, message = "Ayarlar zaten mevcut. Güncellemek için PUT kullanın." });
            }

            settings.CreatedDate = DateTime.UtcNow;
            _context.Settings.Add(settings);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = settings });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Settings settings)
    {
        try
        {
            var existing = await _context.Settings.FirstOrDefaultAsync(s => s.Id == id);
            if (existing == null)
                return NotFound(new { success = false, message = "Ayarlar bulunamadı" });

            existing.SiteName = settings.SiteName ?? existing.SiteName;
            existing.SiteEmail = settings.SiteEmail ?? existing.SiteEmail;
            existing.SitePhone = settings.SitePhone ?? existing.SitePhone;
            existing.Address = settings.Address ?? existing.Address;
            existing.MetaTitle = settings.MetaTitle ?? existing.MetaTitle;
            existing.MetaDescription = settings.MetaDescription ?? existing.MetaDescription;
            existing.MetaKeywords = settings.MetaKeywords ?? existing.MetaKeywords;
            existing.GoogleAnalytics = settings.GoogleAnalytics ?? existing.GoogleAnalytics;
            existing.FacebookPixel = settings.FacebookPixel ?? existing.FacebookPixel;
            existing.FaviconUrl = settings.FaviconUrl ?? existing.FaviconUrl;
            existing.FacebookUrl = settings.FacebookUrl ?? existing.FacebookUrl;
            existing.InstagramUrl = settings.InstagramUrl ?? existing.InstagramUrl;
            existing.TwitterUrl = settings.TwitterUrl ?? existing.TwitterUrl;
            existing.YoutubeUrl = settings.YoutubeUrl ?? existing.YoutubeUrl;
            existing.UpdatedDate = DateTime.UtcNow;

            _context.Settings.Update(existing);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = existing });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var settings = await _context.Settings.FirstOrDefaultAsync(s => s.Id == id);
            if (settings == null)
                return NotFound(new { success = false, message = "Ayarlar bulunamadı" });

            _context.Settings.Remove(settings);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Ayarlar silindi" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}
