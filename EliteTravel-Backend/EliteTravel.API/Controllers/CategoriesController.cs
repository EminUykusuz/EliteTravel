// EliteTravel.API/Controllers/CategoriesController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Data.Contexts;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/categories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.Categories
                    .Where(c => !c.IsDeleted)
                    .Include(c => c.Children)
                    .Include(c => c.TourCategories)
                    .Where(c => c.ParentId == null)
                    .Select(c => new CategoryResponseDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Slug = c.Slug,
                        Description = c.Description,
                        ParentId = c.ParentId,
                        CreatedDate = c.CreatedDate,
                        Children = c.Children.Select(ch => new CategoryResponseDto
                        {
                            Id = ch.Id,
                            Name = ch.Name,
                            Slug = ch.Slug,
                            Description = ch.Description,
                            ParentId = ch.ParentId,
                            CreatedDate = ch.CreatedDate
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategoriler getirilirken hata oluştu", error = ex.Message });
            }
        }

        // GET: api/categories/flat
        [HttpGet("flat")]
        public async Task<IActionResult> GetAllFlat()
        {
            try
            {
                var categories = await _context.Categories
                    .Where(c => !c.IsDeleted)
                    .Include(c => c.TourCategories)
                    .Select(c => new CategoryResponseDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Slug = c.Slug,
                        Description = c.Description,
                        ParentId = c.ParentId,
                        CreatedDate = c.CreatedDate
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategoriler getirilirken hata oluştu", error = ex.Message });
            }
        }

        // GET: api/categories/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var category = await _context.Categories
                    .Where(c => c.Id == id && !c.IsDeleted)
                    .Include(c => c.Children)
                    .Include(c => c.TourCategories)
                    .Select(c => new CategoryResponseDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Slug = c.Slug,
                        Description = c.Description,
                        ParentId = c.ParentId,
                        CreatedDate = c.CreatedDate,
                        Children = c.Children.Select(ch => new CategoryResponseDto
                        {
                            Id = ch.Id,
                            Name = ch.Name,
                            Slug = ch.Slug,
                            Description = ch.Description,
                            ParentId = ch.ParentId,
                            CreatedDate = ch.CreatedDate
                        }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (category == null) return NotFound();
                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategori getirilirken hata oluştu", error = ex.Message });
            }
        }

        // POST: api/categories
        [HttpPost]
        public async Task<IActionResult> Create(CreateCategoryDto dto)
        {
            try
            {
                var category = new Category
                {
                    Name = dto.Name,
                    Slug = dto.Slug,
                    Description = dto.Description,
                    ParentId = dto.ParentId,
                    CreatedDate = DateTime.Now
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategori oluşturulurken hata oluştu", error = ex.Message });
            }
        }

        // PUT: api/categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateCategoryDto dto)
        {
            if (id != dto.Id) return BadRequest();

            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null) return NotFound();

                if (!string.IsNullOrEmpty(dto.Name)) category.Name = dto.Name;
                if (!string.IsNullOrEmpty(dto.Slug)) category.Slug = dto.Slug;
                if (!string.IsNullOrEmpty(dto.Description)) category.Description = dto.Description;
                if (dto.ParentId.HasValue) category.ParentId = dto.ParentId;
                category.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();
                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategori güncellenirken hata oluştu", error = ex.Message });
            }
        }

        // DELETE: api/categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null) return NotFound();

                category.IsDeleted = true;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategori silinirken hata oluştu", error = ex.Message });
            }
        }
    }
}