// --- GEREKLİ TÜM KÜTÜPHANELER ---
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;        
using System;                           
using System.IO;                        
using System.Linq;                      
using System.Threading.Tasks;           
using UykusuzPenApi.Data;               
using UykusuzPenApi.DTOs;               
using UykusuzPenApi.Models;             

namespace UykusuzPenApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SiteAyarlariController : ControllerBase // ControllerBase'den miras alır
    {
        // --- SINIF SEVİYESİNDE DEĞİŞKENLER ---
        private readonly UykusuzPenDbContext _context;
        private readonly IWebHostEnvironment _env;

        // --- CONSTRUCTOR (Doğru yerde) ---
        public SiteAyarlariController(UykusuzPenDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // --- GetAll Metodu (Doğru yerde) ---
        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            try
            {
                var ayarlar = await _context.SiteAyarlari
                    .Select(a => new
                    {
                        id = a.Id,
                        ayar_adi = a.AyarAdi,
                        ayar_degeri = a.AyarDegeri,
                        aciklama = a.Aciklama
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = ayarlar }); // 'Ok' burada çalışır
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message }); // 'BadRequest' burada çalışır
            }
        }

        // --- GetContactInfo Metodu (Doğru yerde) ---
        [HttpGet("contact-info")]
        public async Task<ActionResult> GetContactInfo()
        {
            try
            {
                var ayarlar = await _context.SiteAyarlari
                    .Where(a => a.AyarAdi == "telefon" || a.AyarAdi == "email" || 
                                a.AyarAdi == "adres" || a.AyarAdi == "whatsapp")
                    .ToDictionaryAsync(a => a.AyarAdi, a => a.AyarDegeri);

                return Ok(new { success = true, data = ayarlar });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // --- UploadFile Metodu (Favicon düzeltmesiyle - Doğru yerde) ---
        [HttpPost("upload")]
        [Authorize]
        public async Task<ActionResult> UploadFile([FromForm] FileUploadDto dto)
        {
            if (dto.Dosya == null || dto.Dosya.Length == 0)
                return BadRequest(new { success = false, message = "Dosya seçilmedi" }); // 'BadRequest' burada çalışır

            try
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".svg", ".webp", ".ico" };
                var extension = Path.GetExtension(dto.Dosya.FileName).ToLower();
                
                if (!allowedExtensions.Contains(extension)) // '.Contains' burada çalışır
                    return BadRequest(new { success = false, message = "Geçersiz dosya formatı" });

                if (dto.Dosya.Length > 5 * 1024 * 1024)
                    return BadRequest(new { success = false, message = "Dosya boyutu 5MB'dan küçük olmalı" });

                string fileName;
                string fileUrl;
                string filePath;

                if (dto.AyarAdi.ToLower() == "favicon")
                {
                    fileName = "favicon.ico"; 
                    filePath = Path.Combine(_env.WebRootPath, fileName); // '_env' burada çalışır
                    fileUrl = "/favicon.ico"; 
                }
                else 
                {
                    var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "site");
                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);

                    fileName = $"{dto.AyarAdi}_{Guid.NewGuid()}{extension}";
                    filePath = Path.Combine(uploadsFolder, fileName);
                    fileUrl = $"/uploads/site/{fileName}";
                }
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Dosya.CopyToAsync(stream);
                }

                var ayar = await _context.SiteAyarlari // '_context' burada çalışır
                    .FirstOrDefaultAsync(a => a.AyarAdi == dto.AyarAdi);

                if (ayar != null)
                {
                    if (dto.AyarAdi.ToLower() != "favicon" && !string.IsNullOrEmpty(ayar.AyarDegeri))
                    {
                        var oldFilePath = Path.Combine(_env.WebRootPath, ayar.AyarDegeri.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }
                    ayar.AyarDegeri = fileUrl; 
                    ayar.Aciklama = dto.Aciklama;
                }
                else
                {
                    _context.SiteAyarlari.Add(new SiteAyari
                    {
                        AyarAdi = dto.AyarAdi,
                        AyarDegeri = fileUrl,
                        Aciklama = dto.Aciklama
                    });
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Dosya yüklendi", fileUrl = fileUrl }); // 'Ok' burada çalışır
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // --- Update Metodu (Doğru yerde) ---
        [HttpPut]
        [Authorize]
        public async Task<ActionResult> Update([FromBody] SiteAyariUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, errors = ModelState });

            try
            {
                var ayarlar = await _context.SiteAyarlari.ToListAsync();

                if (!string.IsNullOrEmpty(dto.SiteBaslik))
                {
                    var siteBaslik = ayarlar.FirstOrDefault(a => a.AyarAdi == "site_baslik");
                    if (siteBaslik != null) siteBaslik.AyarDegeri = dto.SiteBaslik;
                }
                // ... (diğer if blokları) ...
                if (!string.IsNullOrEmpty(dto.Telefon))
                {
                    var telefon = ayarlar.FirstOrDefault(a => a.AyarAdi == "telefon");
                    if (telefon != null) telefon.AyarDegeri = dto.Telefon;
                }
                if (!string.IsNullOrEmpty(dto.Email))
                {
                    var email = ayarlar.FirstOrDefault(a => a.AyarAdi == "email");
                    if (email != null) email.AyarDegeri = dto.Email;
                }
                if (!string.IsNullOrEmpty(dto.Adres))
                {
                    var adres = ayarlar.FirstOrDefault(a => a.AyarAdi == "adres");
                    if (adres != null) adres.AyarDegeri = dto.Adres;
                }
                if (!string.IsNullOrEmpty(dto.Whatsapp))
                {
                    var whatsapp = ayarlar.FirstOrDefault(a => a.AyarAdi == "whatsapp");
                    if (whatsapp != null) whatsapp.AyarDegeri = dto.Whatsapp;
                }


                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Site ayarları güncellendi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    } // <-- Sınıf burada biter
}