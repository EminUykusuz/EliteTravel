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
    public class DashboardController : ControllerBase
    {
        private readonly UykusuzPenDbContext _context;

        public DashboardController(UykusuzPenDbContext context)
        {
            _context = context;
        }

        // GET: api/dashboard/stats
        [HttpGet("stats")]
        public async Task<ActionResult> GetDashboardStats()
        {
            try
            {
                var toplamGaleri = await _context.Galeri.CountAsync();
                var toplamUrun = await _context.Urunler.CountAsync();
                var toplamKategori = await _context.Kategoriler.CountAsync();
                var toplamMesaj = await _context.IletisimMesajlari.CountAsync();
                var yeniMesajlar = await _context.IletisimMesajlari.CountAsync(m => m.Durum == "yeni");
                
                var buAyMesajlar = await _context.IletisimMesajlari
                    .CountAsync(m => m.Tarih.Month == DateTime.Now.Month && m.Tarih.Year == DateTime.Now.Year);

                var sonEklenenGaleri = await _context.Galeri
                    .OrderByDescending(g => g.Id)
                    .Take(5)
                    .Select(g => new { g.Id, g.Baslik })
                    .ToListAsync();

                var sonEklenenUrunler = await _context.Urunler
                    .OrderByDescending(u => u.Id)
                    .Take(5)
                    .Select(u => new { u.Id, u.UrunAdi })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        genel = new
                        {
                            toplamGaleri,
                            toplamUrun,
                            toplamKategori,
                            toplamMesaj,
                            yeniMesajlar,
                            buAyMesajlar
                        },
                        sonEklenenler = new
                        {
                            galeri = sonEklenenGaleri,
                            urunler = sonEklenenUrunler
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}