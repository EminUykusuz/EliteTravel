using Microsoft.EntityFrameworkCore;
using UykusuzPenApi.Data;
using UykusuzPenApi.DTOs;
using UykusuzPenApi.Models;
using UykusuzPenApi.Services.Interfaces;

// Alias
using DTOs = UykusuzPenApi.DTOs;
using M = UykusuzPenApi.Models;

namespace UykusuzPenApi.Services
{
    public class UrunService : IUrunService
    {
        private readonly UykusuzPenDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<UrunService> _logger;

        public UrunService(
            UykusuzPenDbContext context, 
            IWebHostEnvironment environment,
            ILogger<UrunService> logger)
        {
            _context = context;
            _environment = environment;
            _logger = logger;
        }

        public async Task<IEnumerable<DTOs.UrunDto>> GetAllAsync(string? kategori = null)
        {
            var query = _context.Urunler
                .Include(u => u.Kategori)
                .Include(u => u.UrunRenkler).ThenInclude(ur => ur.Renk)
                .Include(u => u.UrunResimleri)
                .AsQueryable();

            if (!string.IsNullOrEmpty(kategori))
                query = query.Where(u => u.Kategori != null && u.Kategori.Slug == kategori);

            var urunler = await query.OrderByDescending(u => u.Id).ToListAsync();
            return urunler.Select(MapToDto);
        }

        public async Task<DTOs.UrunDto?> GetByIdAsync(int id)
        {
            var urun = await _context.Urunler
                .Include(u => u.Kategori)
                .Include(u => u.UrunRenkler).ThenInclude(ur => ur.Renk)
                .Include(u => u.UrunResimleri)
                .FirstOrDefaultAsync(u => u.Id == id);

            return urun != null ? MapToDto(urun) : null;
        }

        public async Task<DTOs.UrunDto> CreateAsync(DTOs.UrunCreateDto dto)
        {
            var urun = new M.Urun
            {
                UrunAdi = dto.UrunAdi,
                Aciklama = dto.Aciklama,
                KategoriId = dto.KategoriId
            };

            // Ana resmi yükle
            if (dto.AnaResim != null)
            {
                urun.AnaResim = await UploadFileAsync(dto.AnaResim, "urunler/ana-resimler");
            }

            _context.Urunler.Add(urun);
            await _context.SaveChangesAsync();

            // Renkleri ekle
            if (dto.RenkIds != null)
            {
                foreach (var renkId in dto.RenkIds)
                {
                    _context.UrunRenkler.Add(new M.UrunRenk { UrunId = urun.Id, RenkId = renkId });
                }
            }

            // Diğer resimleri yükle
            if (dto.DigerResimler != null)
            {
                foreach (var resim in dto.DigerResimler)
                {
                    var resimYolu = await UploadFileAsync(resim, "urunler/diger-resimler");
                    _context.UrunResimleri.Add(new UrunResim
                    {
                        UrunId = urun.Id,
                        ResimYolu = resimYolu,
                        AltText = $"{urun.UrunAdi} resmi"
                    });
                }
            }

            await _context.SaveChangesAsync();
            return (await GetByIdAsync(urun.Id))!;
        }

        public async Task<UrunDto?> UpdateAsync(int id, UrunUpdateDto dto)
        {
            var urun = await _context.Urunler
                .Include(u => u.UrunRenkler)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (urun == null) return null;

            if (dto.UrunAdi != null) urun.UrunAdi = dto.UrunAdi;
            if (dto.Aciklama != null) urun.Aciklama = dto.Aciklama;
            if (dto.KategoriId.HasValue) urun.KategoriId = dto.KategoriId;

            // Ana resmi güncelle
            if (dto.AnaResim != null)
            {
                if (!string.IsNullOrEmpty(urun.AnaResim))
                    DeleteFile(urun.AnaResim);
                    
                urun.AnaResim = await UploadFileAsync(dto.AnaResim, "urunler/ana-resimler");
            }

            // Renkleri güncelle
            if (dto.RenkIds != null)
            {
                _context.UrunRenkler.RemoveRange(urun.UrunRenkler);
                foreach (var renkId in dto.RenkIds)
                {
                    _context.UrunRenkler.Add(new UrunRenk { UrunId = id, RenkId = renkId });
                }
            }

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var urun = await _context.Urunler
                .Include(u => u.UrunResimleri)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (urun == null) return false;

            // Ana resmi sil
            if (!string.IsNullOrEmpty(urun.AnaResim))
                DeleteFile(urun.AnaResim);

            // Diğer resimleri sil
            foreach (var resim in urun.UrunResimleri)
            {
                DeleteFile(resim.ResimYolu);
            }

            _context.Urunler.Remove(urun);
            await _context.SaveChangesAsync();
            return true;
        }

        private UrunDto MapToDto(M.Urun urun)
        {
            return new UrunDto
            {
                Id = urun.Id,
                UrunAdi = urun.UrunAdi,
                Aciklama = urun.Aciklama,
                Kategori = urun.Kategori != null ? new KategoriDto
                {
                    Id = urun.Kategori.Id,
                    KategoriAdi = urun.Kategori.KategoriAdi,
                    Slug = urun.Kategori.Slug
                } : null,
                AnaResim = urun.AnaResim,
                Renkler = urun.UrunRenkler.Select(ur => new RenkDto
                {
                    Id = ur.Renk.Id,
                    RenkAdi = ur.Renk.RenkAdi
                }).ToList(),
                Resimler = urun.UrunResimleri.Select(resim => new UrunResimDto
                {
                    Id = resim.Id,
                    ResimYolu = resim.ResimYolu,
                    AltText = resim.AltText
                }).ToList()
            };
        }

        // ============================================
        // HELPER METHODS - Dosya yükleme/silme
        // ============================================

        private async Task<string> UploadFileAsync(IFormFile file, string folder)
        {
            try
            {
                var uploadPath = Path.Combine(_environment.WebRootPath, "uploads", folder);

                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Path.Combine("uploads", folder, fileName).Replace("\\", "/");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Dosya yüklenirken hata: {FileName}", file.FileName);
                throw new Exception($"Dosya yüklenemedi: {ex.Message}");
            }
        }

        private void DeleteFile(string? filePath)
        {
            if (string.IsNullOrEmpty(filePath)) return;

            try
            {
                var fullPath = Path.Combine(_environment.WebRootPath, filePath);
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    _logger.LogInformation("Dosya silindi: {FilePath}", filePath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Dosya silinirken hata: {FilePath}", filePath);
            }
        }
    }
}