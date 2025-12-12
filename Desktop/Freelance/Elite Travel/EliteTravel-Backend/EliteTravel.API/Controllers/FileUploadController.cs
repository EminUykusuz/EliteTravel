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

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            if (!Array.Exists(allowedExtensions, ext => ext == extension))
                return BadRequest("Sadece resim dosyaları yüklenebilir");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "tours");
            
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileUrl = $"/uploads/tours/{fileName}";
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
