using Microsoft.EntityFrameworkCore;
using UykusuzPenApi.Data;
using UykusuzPenApi.DTOs;
using UykusuzPenApi.Models;
using UykusuzPenApi.Services.Interfaces;

namespace UykusuzPenApi.Services
{
    public class GaleriService : IGaleriService
    {
        private readonly UykusuzPenDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<GaleriService> _logger;

        public GaleriService(
            UykusuzPenDbContext context, 
            IWebHostEnvironment environment,
            ILogger<GaleriService> logger)
        {
            _context = context;
            _environment = environment;
            _logger = logger;
        }

        public async Task<IEnumerable<GaleriDto>> GetAllAsync(string? kategori = null, string? il = null, string? medyaTipi = null)
        {
            var query = _context.Galeri.Include(g => g.Kategori).AsQueryable();

            if (!string.IsNullOrEmpty(kategori))
                query = query.Where(g => g.Kategori != null && g.Kategori.Slug == kategori);

            if (!string.IsNullOrEmpty(il))
                query = query.Where(g => g.Il == il);

            if (!string.IsNullOrEmpty(medyaTipi))
                query = query.Where(g => g.MedyaTipi == medyaTipi);

            var galeriler = await query.OrderByDescending(g => g.Id).ToListAsync();

            return galeriler.Select(g => new GaleriDto
            {
                Id = g.Id,
                Baslik = g.Baslik,
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
        }

        public async Task<GaleriDto?> GetByIdAsync(int id)
        {
            var galeri = await _context.Galeri
                .Include(g => g.Kategori)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (galeri == null) return null;

            return new GaleriDto
            {
                Id = galeri.Id,
                Baslik = galeri.Baslik,
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
        }

        public async Task<GaleriDto> CreateAsync(GaleriCreateDto dto)
        {
            // Medya dosyasını yükle
            var medyaYolu = await UploadFileAsync(dto.MedyaDosyasi, "galeri", dto.MedyaTipi);
            
            // Kapak resmini yükle (varsa)
            string? kapakResmi = null;
            if (dto.KapakResmi != null)
            {
                kapakResmi = await UploadFileAsync(dto.KapakResmi, "galeri/kapaklar");
            }

            var galeri = new Galeri
            {
                Baslik = dto.Baslik,
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

            var result = await GetByIdAsync(galeri.Id);
            return result!;
        }

        public async Task<GaleriDto?> UpdateAsync(int id, GaleriUpdateDto dto)
        {
            var galeri = await _context.Galeri.FindAsync(id);
            if (galeri == null) return null;

            // Yeni medya dosyası varsa eskiyi sil ve yeniyi yükle
            if (dto.MedyaDosyasi != null)
            {
                DeleteFile(galeri.MedyaYolu);
                galeri.MedyaYolu = await UploadFileAsync(
                    dto.MedyaDosyasi, 
                    "galeri", 
                    dto.MedyaTipi ?? galeri.MedyaTipi
                );
            }

            // Yeni kapak resmi varsa eskiyi sil ve yeniyi yükle
            if (dto.KapakResmi != null)
            {
                if (!string.IsNullOrEmpty(galeri.KapakResmi))
                    DeleteFile(galeri.KapakResmi);
                    
                galeri.KapakResmi = await UploadFileAsync(dto.KapakResmi, "galeri/kapaklar");
            }

            // Diğer alanları güncelle
            if (dto.Baslik != null) galeri.Baslik = dto.Baslik;
            if (dto.Aciklama != null) galeri.Aciklama = dto.Aciklama;
            if (dto.KategoriId.HasValue) galeri.KategoriId = dto.KategoriId;
            if (dto.Il != null) galeri.Il = dto.Il;
            if (dto.Ilce != null) galeri.Ilce = dto.Ilce;
            if (dto.MedyaTipi != null) galeri.MedyaTipi = dto.MedyaTipi;
            if (dto.AltText != null) galeri.AltText = dto.AltText;

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var galeri = await _context.Galeri.FindAsync(id);
            if (galeri == null) return false;

            // Dosyaları sil
            DeleteFile(galeri.MedyaYolu);
            if (!string.IsNullOrEmpty(galeri.KapakResmi))
                DeleteFile(galeri.KapakResmi);

            _context.Galeri.Remove(galeri);
            await _context.SaveChangesAsync();
            return true;
        }

        // ============================================
        // HELPER METHODS - Dosya yükleme/silme
        // ============================================

        private async Task<string> UploadFileAsync(IFormFile file, string folder, string? subfolder = null)
        {
            try
            {
                // Klasör yolu oluştur: wwwroot/uploads/galeri veya wwwroot/uploads/galeri/resimler
                var uploadPath = Path.Combine(_environment.WebRootPath, "uploads", folder);
                
                if (!string.IsNullOrEmpty(subfolder))
                    uploadPath = Path.Combine(uploadPath, subfolder);

                // Klasör yoksa oluştur
                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                // Benzersiz dosya adı oluştur
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadPath, fileName);

                // Dosyayı kaydet
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Veritabanına kaydedilecek relatif yol
                var relativePath = Path.Combine("uploads", folder);
                if (!string.IsNullOrEmpty(subfolder))
                    relativePath = Path.Combine(relativePath, subfolder);
                    
                return Path.Combine(relativePath, fileName).Replace("\\", "/");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Dosya yüklenirken hata oluştu: {FileName}", file.FileName);
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
                // Hata fırlat değil, sadece logla (silme işlemi kritik değil)
            }
        }
    }
}