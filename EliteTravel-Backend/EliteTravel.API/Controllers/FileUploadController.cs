using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace EliteTravel.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileUploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public FileUploadController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Dosya seçilmedi");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".ico" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            if (!Array.Exists(allowedExtensions, ext => ext == extension))
                return BadRequest("Sadece resim dosyaları yüklenebilir");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "tours");
            
            Console.WriteLine($"[UPLOAD] WebRootPath: {_env.WebRootPath}");
            Console.WriteLine($"[UPLOAD] Upload klasörü: {uploadsFolder}");
            
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
                Console.WriteLine($"[UPLOAD] Klasör oluşturuldu: {uploadsFolder}");
            }

            var filePath = Path.Combine(uploadsFolder, fileName);
            Console.WriteLine($"[UPLOAD] Dosya tam yolu: {filePath}");

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            Console.WriteLine($"[UPLOAD] ✅ Dosya kaydedildi: {fileName}");

            var fileUrl = $"/uploads/tours/{fileName}";
            Console.WriteLine($"[UPLOAD] Döndürülen URL: {fileUrl}");
            return Ok(new { url = fileUrl, fileName = fileName });
        }

        [HttpPost("upload-favicon")]
        public async Task<IActionResult> UploadFavicon(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Dosya seçilmedi");

            var allowedExtensions = new[] { ".ico", ".png" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            if (!Array.Exists(allowedExtensions, ext => ext == extension))
                return BadRequest("Sadece .ico veya .png dosyaları yüklenebilir");

            var fileName = $"favicon{extension}";
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "favicon");
            
            Console.WriteLine($"[FAVICON] WebRootPath: {_env.WebRootPath}");
            Console.WriteLine($"[FAVICON] Upload klasörü: {uploadsFolder}");
            
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
                Console.WriteLine($"[FAVICON] Klasör oluşturuldu: {uploadsFolder}");
            }

            var filePath = Path.Combine(uploadsFolder, fileName);
            
            // Eski favicon varsa sil
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
                Console.WriteLine($"[FAVICON] Eski favicon silindi");
            }
            
            Console.WriteLine($"[FAVICON] Dosya tam yolu: {filePath}");

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            Console.WriteLine($"[FAVICON] ✅ Favicon kaydedildi: {fileName}");

            var fileUrl = $"/uploads/favicon/{fileName}";
            Console.WriteLine($"[FAVICON] Döndürülen URL: {fileUrl}");
            return Ok(new { url = fileUrl, fileName = fileName });
        }

        [HttpDelete("delete-image")]
        public IActionResult DeleteImage([FromQuery] string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("Dosya adı gerekli");

            var filePath = Path.Combine(_env.WebRootPath, "uploads", "tours", fileName);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
                return Ok(new { message = "Dosya silindi" });
            }

            return NotFound("Dosya bulunamadı");
        }
    }
}
