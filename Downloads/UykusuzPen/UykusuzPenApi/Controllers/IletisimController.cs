using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UykusuzPenApi.Data;
using UykusuzPenApi.DTOs;
using UykusuzPenApi.Models;

namespace UykusuzPenApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IletisimController : ControllerBase
    {
        private readonly UykusuzPenDbContext _context;
        private readonly IEmailService _emailService;

        // TEK CONSTRUCTOR - İkisini birleştir
        public IletisimController(UykusuzPenDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // GET: api/iletisim
        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            try
            {
                var messages = await _context.IletisimMesajlari
                    .OrderByDescending(m => m.Tarih)
                    .Select(m => new
                    {
                        m.Id,
                        m.AdSoyad,
                        m.Email,
                        m.Telefon,
                        m.FirmaAdi,
                        m.IsTuru,
                        m.Mesaj,
                        m.Durum,
                        m.Tarih
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = messages });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // POST: api/iletisim
        [HttpPost]
        public async Task<ActionResult> SendMessage([FromBody] IletisimMesajiDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, errors = ModelState });

            try
            {
                var mesaj = new IletisimMesaji
                {
                    AdSoyad = dto.AdSoyad,
                    Email = dto.Email,
                    Telefon = dto.Telefon,
                    FirmaAdi = string.IsNullOrEmpty(dto.FirmaAdi) ? "Kişisel" : dto.FirmaAdi,
                    IsTuru = dto.IsTuru,
                    Mesaj = dto.Mesaj,
                    Durum = "yeni",
                    Tarih = DateTime.UtcNow
                };

                _context.IletisimMesajlari.Add(mesaj);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Mesajınız başarıyla gönderildi." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // PUT: api/iletisim/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateMessageStatus(int id, [FromBody] UpdateMessageStatusDto dto)
        {
            var mesaj = await _context.IletisimMesajlari.FindAsync(id);
            if (mesaj == null)
                return NotFound(new { success = false, message = "Mesaj bulunamadı." });

            if (string.IsNullOrEmpty(dto.Durum))
                return BadRequest(new { success = false, message = "Durum belirtilmedi." });

            mesaj.Durum = dto.Durum;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Mesaj durumu güncellendi." });
        }

        // DELETE: api/iletisim/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var mesaj = await _context.IletisimMesajlari.FindAsync(id);
            if (mesaj == null)
                return NotFound(new { success = false, message = "Mesaj bulunamadı." });

            _context.IletisimMesajlari.Remove(mesaj);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Mesaj silindi." });
        }

        // POST: api/iletisim/send-email
        [HttpPost("send-email")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.To) || string.IsNullOrEmpty(request.Message))
                {
                    return BadRequest(new ApiResponse 
                    { 
                        Success = false, 
                        Message = "E-posta adresi ve mesaj zorunludur." 
                    });
                }

                // HTML e-posta şablonu
                var htmlMessage = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                        <h2 style='color: #3b82f6;'>Merhaba {request.CustomerName},</h2>
                        <p>Mesajınız için teşekkür ederiz. İşte cevabımız:</p>
                        
                        <div style='background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                            <p style='margin: 0; white-space: pre-wrap;'>{request.Message}</p>
                        </div>

                        <hr style='border: 1px solid #e5e7eb; margin: 20px 0;'>
                        
                        <p style='color: #6b7280; font-size: 14px;'>
                            <strong>Orijinal Mesajınız:</strong><br>
                            {request.OriginalMessage}
                        </p>

                        <p style='color: #6b7280; font-size: 12px; margin-top: 30px;'>
                            Bu e-posta otomatik olarak gönderilmiştir.
                        </p>
                    </div>
                ";

                var result = await _emailService.SendEmailAsync(
                    request.To, 
                    request.Subject, 
                    htmlMessage
                );

                if (result)
                {
                    return Ok(new ApiResponse 
                    { 
                        Success = true, 
                        Message = "E-posta başarıyla gönderildi" 
                    });
                }
                else
                {
                    return StatusCode(500, new ApiResponse 
                    { 
                        Success = false, 
                        Message = "E-posta gönderilemedi" 
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse 
                { 
                    Success = false, 
                    Message = $"Hata: {ex.Message}" 
                });
            }
        }
    }
}