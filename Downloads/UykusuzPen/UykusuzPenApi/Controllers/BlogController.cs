using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UykusuzPenApi.Data;
using UykusuzPenApi.Models;
using UykusuzPenApi.DTOs;

namespace UykusuzPenApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly UykusuzPenDbContext _context;
        private readonly IWebHostEnvironment _env;

        public BlogController(UykusuzPenDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogDto>>> GetBloglar()
        {
            var blogs = await _context.Bloglar
                .OrderByDescending(b => b.OlusturulmaTarihi)
                .Select(b => new BlogDto
                {
                    Id = b.Id,
                    Baslik = b.Baslik,
                    Aciklama = b.Aciklama,
                    ResimUrl = string.IsNullOrEmpty(b.ResimUrl) ? null : $"{Request.Scheme}://{Request.Host}{b.ResimUrl}",
                    OlusturulmaTarihi = b.OlusturulmaTarihi
                }).ToListAsync();

            return Ok(blogs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogDto>> GetBlog(int id)
        {
            var blog = await _context.Bloglar.FindAsync(id);
            if (blog == null) return NotFound();

            var dto = new BlogDto
            {
                Id = blog.Id,
                Baslik = blog.Baslik,
                Aciklama = blog.Aciklama,
                ResimUrl = string.IsNullOrEmpty(blog.ResimUrl) ? null : $"{Request.Scheme}://{Request.Host}{blog.ResimUrl}",
                OlusturulmaTarihi = blog.OlusturulmaTarihi
            };

            return Ok(dto);
        }

     public async Task<ActionResult<BlogDto>> CreateBlog([FromForm] BlogDto dto)
{
    string? filePath = null;

    var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
    var uploadsDir = Path.Combine(webRoot, "uploads");
    if (!Directory.Exists(uploadsDir))
        Directory.CreateDirectory(uploadsDir);

    if (dto.Resim != null)
    {
        var fileName = $"{Guid.NewGuid()}_{dto.Resim.FileName}";
        var savePath = Path.Combine(uploadsDir, fileName);

        using var stream = new FileStream(savePath, FileMode.Create);
        await dto.Resim.CopyToAsync(stream);

        filePath = $"/uploads/{fileName}";
    }
    
    var blog = new Blog
    {
        Baslik = dto.Baslik,
        Aciklama = dto.Aciklama,
        ResimUrl = filePath,
        OlusturulmaTarihi = DateTime.Now
    };

    _context.Bloglar.Add(blog);
    await _context.SaveChangesAsync();

    dto.Id = blog.Id;
    dto.ResimUrl = $"{Request.Scheme}://{Request.Host}{filePath}";
    dto.OlusturulmaTarihi = blog.OlusturulmaTarihi;

    return CreatedAtAction(nameof(GetBlog), new { id = blog.Id }, dto);
}

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlog(int id, [FromForm] BlogDto dto)
        {
            var blog = await _context.Bloglar.FindAsync(id);
            if (blog == null) return NotFound();

            blog.Baslik = dto.Baslik;
            blog.Aciklama = dto.Aciklama;

            if (dto.Resim != null)
            {
                var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsDir))
                    Directory.CreateDirectory(uploadsDir);

                var fileName = $"{Guid.NewGuid()}_{dto.Resim.FileName}";
                var savePath = Path.Combine(uploadsDir, fileName);

                using var stream = new FileStream(savePath, FileMode.Create);
                await dto.Resim.CopyToAsync(stream);

                // Önceki dosya varsa sil
                if (!string.IsNullOrEmpty(blog.ResimUrl))
                {
                    var oldPath = Path.Combine(_env.WebRootPath, blog.ResimUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                blog.ResimUrl = $"/uploads/{fileName}";
            }

            _context.Entry(blog).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await _context.Bloglar.FindAsync(id);
            if (blog == null) return NotFound();

            if (!string.IsNullOrEmpty(blog.ResimUrl))
            {
                var fullPath = Path.Combine(_env.WebRootPath, blog.ResimUrl.TrimStart('/'));
                if (System.IO.File.Exists(fullPath))
                    System.IO.File.Delete(fullPath);
            }

            _context.Bloglar.Remove(blog);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
