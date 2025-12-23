using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Data.Contexts;
using Microsoft.EntityFrameworkCore;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuidesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public GuidesController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/guides
        [HttpGet]
        public async Task<ActionResult<PaginatedResultDto<GuideResponseDto>>> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.Guides
                    .Include(g => g.Tours)
                    .Where(g => !g.IsDeleted);

                var totalCount = await query.CountAsync();
                
                var guides = await query
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(g => new GuideResponseDto
                    {
                        Id = g.Id,
                        Name = g.Name,
                        Description = g.Description,
                        Image = g.Image,
                        HireAmount = g.HireAmount,
                        Currency = g.Currency,
                        InstagramUrl = g.InstagramUrl,
                        Tours = g.Tours.Select(t => new TourSimpleDto 
                        { 
                            Id = t.Id, 
                            Title = t.Title 
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(new PaginatedResultDto<GuideResponseDto>
                {
                    Items = guides,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/guides/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<GuideResponseDto>>> GetById(int id)
        {
            try
            {
                var guide = await _context.Guides
                    .Include(g => g.Tours)
                    .FirstOrDefaultAsync(g => g.Id == id && !g.IsDeleted);

                if (guide == null)
                    return NotFound(ApiResponseDto<GuideResponseDto>.ErrorResponse("Guide not found"));

                var guideDto = new GuideResponseDto
                {
                    Id = guide.Id,
                    Name = guide.Name,
                    Description = guide.Description,
                    Image = guide.Image,
                    HireAmount = guide.HireAmount,
                    Currency = guide.Currency,
                    InstagramUrl = guide.InstagramUrl,
                    Tours = guide.Tours.Select(t => new TourSimpleDto 
                    { 
                        Id = t.Id, 
                        Title = t.Title 
                    }).ToList()
                };

                return Ok(ApiResponseDto<GuideResponseDto>.SuccessResponse(guideDto, "Guide found"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<GuideResponseDto>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        // POST: api/guides
        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<GuideResponseDto>>> Create(
            [FromForm] string name,
            [FromForm] string? description,
            [FromForm] int? hireAmount,
            [FromForm] string? currency,
            [FromForm] string? instagramUrl,
            [FromForm] IFormFile? image)
        {
            try
            {
                var guide = new Guide
                {
                    Name = name,
                    Description = description,
                    HireAmount = hireAmount,
                    Currency = currency ?? "TRY",
                    InstagramUrl = instagramUrl,
                    CreatedDate = DateTime.UtcNow // 👈 DÜZELTME: CreatedDate
                };

                // Resim varsa kaydet
                if (image != null && image.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "guides");
                    Directory.CreateDirectory(uploadsFolder);

                    var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(image.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    guide.Image = $"/uploads/guides/{fileName}";
                }

                _context.Guides.Add(guide);
                await _context.SaveChangesAsync();

                var guideDto = new GuideResponseDto
                {
                    Id = guide.Id,
                    Name = guide.Name,
                    Description = guide.Description,
                    Image = guide.Image,
                    HireAmount = guide.HireAmount,
                    Currency = guide.Currency,
                    InstagramUrl = guide.InstagramUrl
                };

                return CreatedAtAction(nameof(GetById), new { id = guide.Id },
                    ApiResponseDto<GuideResponseDto>.SuccessResponse(guideDto, "Guide created successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseDto<GuideResponseDto>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        // PUT: api/guides/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<GuideResponseDto>>> Update(
            int id,
            [FromForm] string name,
            [FromForm] string? description,
            [FromForm] int? hireAmount,
            [FromForm] string? currency,
            [FromForm] string? instagramUrl,
            [FromForm] IFormFile? image)
        {
            try
            {
                var guide = await _context.Guides.FindAsync(id);
                if (guide == null || guide.IsDeleted)
                    return NotFound(ApiResponseDto<GuideResponseDto>.ErrorResponse("Guide not found"));

                guide.Name = name;
                guide.Description = description;
                guide.HireAmount = hireAmount;
                guide.Currency = currency ?? "TRY";
                guide.InstagramUrl = instagramUrl;
                guide.UpdatedDate = DateTime.UtcNow; // 👈 DÜZELTME: UpdatedDate

                // Yeni resim varsa kaydet
                if (image != null && image.Length > 0)
                {
                    // Eski resmi sil (varsa)
                    if (!string.IsNullOrEmpty(guide.Image))
                    {
                        var oldFilePath = Path.Combine(_env.WebRootPath, guide.Image.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "guides");
                    Directory.CreateDirectory(uploadsFolder);

                    var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(image.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    guide.Image = $"/uploads/guides/{fileName}";
                }

                await _context.SaveChangesAsync();

                var guideDto = new GuideResponseDto
                {
                    Id = guide.Id,
                    Name = guide.Name,
                    Description = guide.Description,
                    Image = guide.Image,
                    HireAmount = guide.HireAmount,
                    Currency = guide.Currency,
                    InstagramUrl = guide.InstagramUrl
                };

                return Ok(ApiResponseDto<GuideResponseDto>.SuccessResponse(guideDto, "Guide updated successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseDto<GuideResponseDto>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        // DELETE: api/guides/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            try
            {
                var guide = await _context.Guides.FindAsync(id);
                if (guide == null)
                    return NotFound(ApiResponseDto<bool>.ErrorResponse("Guide not found"));

                guide.IsDeleted = true;
                guide.UpdatedDate = DateTime.UtcNow; // 👈 DÜZELTME: UpdatedDate
                await _context.SaveChangesAsync();

                return Ok(ApiResponseDto<bool>.SuccessResponse(true, "Guide deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<bool>.ErrorResponse($"Error: {ex.Message}"));
            }
        }
    }
}