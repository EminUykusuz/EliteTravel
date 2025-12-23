using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Data.Contexts;
using Microsoft.EntityFrameworkCore;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MenuItemsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/menuitems
        [HttpGet]
        public async Task<ActionResult<ApiResponseDto<List<MenuItemDto>>>> GetAll()
        {
            try
            {
                var menuItems = await _context.MenuItems
                    .Where(m => !m.IsDeleted && m.ParentId == null)
                    .OrderBy(m => m.Order)
                    .Include(m => m.Translations.Where(t => !t.IsDeleted))
                        .ThenInclude(t => t.Language)
                    .Include(m => m.Children.Where(c => !c.IsDeleted).OrderBy(c => c.Order))
                        .ThenInclude(c => c.Translations.Where(t => !t.IsDeleted))
                            .ThenInclude(t => t.Language)
                    .ToListAsync();

                var menuDtos = menuItems.Select(m => MapToDto(m)).ToList();
                
                return Ok(ApiResponseDto<List<MenuItemDto>>.SuccessResponse(
                    menuDtos, 
                    "Menu items retrieved successfully"
                ));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<List<MenuItemDto>>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        // GET: api/menuitems/flat
        [HttpGet("flat")]
        public async Task<ActionResult<ApiResponseDto<List<MenuItemDto>>>> GetFlat()
        {
            try
            {
                var menuItems = await _context.MenuItems
                    .Where(m => !m.IsDeleted)
                    .OrderBy(m => m.Order)
                    .ToListAsync();

                var menuDtos = menuItems.Select(m => new MenuItemDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Url = m.Url,
                    Order = m.Order,
                    ParentId = m.ParentId
                }).ToList();

                return Ok(ApiResponseDto<List<MenuItemDto>>.SuccessResponse(
                    menuDtos, 
                    "Flat menu items retrieved successfully"
                ));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<List<MenuItemDto>>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        // GET: api/menuitems/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<MenuItemDto>>> GetById(int id)
        {
            try
            {
                var menuItem = await _context.MenuItems
                    .Include(m => m.Translations.Where(t => !t.IsDeleted))
                        .ThenInclude(t => t.Language)
                    .Include(m => m.Children.Where(c => !c.IsDeleted))
                        .ThenInclude(c => c.Translations.Where(t => !t.IsDeleted))
                            .ThenInclude(t => t.Language)
                    .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

                if (menuItem == null)
                    return NotFound(ApiResponseDto<MenuItemDto>.ErrorResponse("Menu item not found"));

                return Ok(ApiResponseDto<MenuItemDto>.SuccessResponse(
                    MapToDto(menuItem), 
                    "Menu item found"
                ));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<MenuItemDto>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        // POST: api/menuitems
        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<MenuItemDto>>> Create([FromBody] CreateMenuItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<MenuItemDto>.ErrorResponse("Validation failed"));

            try
            {
                var menuItem = new MenuItem
                {
                    Title = dto.Title,
                    Url = dto.Url,
                    Order = dto.Order,
                    ParentId = dto.ParentId,
                    CreatedDate = DateTime.UtcNow
                };

                _context.MenuItems.Add(menuItem);
                await _context.SaveChangesAsync();

                await UpsertTranslationsAsync(menuItem.Id, dto.Translations);

                var created = await _context.MenuItems
                    .Include(m => m.Translations.Where(t => !t.IsDeleted))
                        .ThenInclude(t => t.Language)
                    .Include(m => m.Children.Where(c => !c.IsDeleted))
                        .ThenInclude(c => c.Translations.Where(t => !t.IsDeleted))
                            .ThenInclude(t => t.Language)
                    .FirstOrDefaultAsync(m => m.Id == menuItem.Id);

                return CreatedAtAction(
                    nameof(GetById), 
                    new { id = menuItem.Id },
                    ApiResponseDto<MenuItemDto>.SuccessResponse(
                        created != null ? MapToDto(created) : MapToDto(menuItem),
                        "Menu item created successfully"
                    )
                );
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseDto<MenuItemDto>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        // PUT: api/menuitems/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<MenuItemDto>>> Update(int id, [FromBody] UpdateMenuItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<MenuItemDto>.ErrorResponse("Validation failed"));

            try
            {
                var menuItem = await _context.MenuItems.FindAsync(id);
                if (menuItem == null || menuItem.IsDeleted)
                    return NotFound(ApiResponseDto<MenuItemDto>.ErrorResponse("Menu item not found"));

                menuItem.Title = dto.Title;
                menuItem.Url = dto.Url;
                menuItem.Order = dto.Order;
                menuItem.ParentId = dto.ParentId;
                menuItem.UpdatedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                await UpsertTranslationsAsync(menuItem.Id, dto.Translations);

                var updated = await _context.MenuItems
                    .Include(m => m.Translations.Where(t => !t.IsDeleted))
                        .ThenInclude(t => t.Language)
                    .Include(m => m.Children.Where(c => !c.IsDeleted))
                        .ThenInclude(c => c.Translations.Where(t => !t.IsDeleted))
                            .ThenInclude(t => t.Language)
                    .FirstOrDefaultAsync(m => m.Id == menuItem.Id);

                return Ok(ApiResponseDto<MenuItemDto>.SuccessResponse(
                    updated != null ? MapToDto(updated) : MapToDto(menuItem),
                    "Menu item updated successfully"
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseDto<MenuItemDto>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        // DELETE: api/menuitems/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            try
            {
                var menuItem = await _context.MenuItems.FindAsync(id);
                if (menuItem == null)
                    return NotFound(ApiResponseDto<bool>.ErrorResponse("Menu item not found"));

                menuItem.IsDeleted = true;
                menuItem.UpdatedDate = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(ApiResponseDto<bool>.SuccessResponse(
                    true, 
                    "Menu item deleted successfully"
                ));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponseDto<bool>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        private MenuItemDto MapToDto(MenuItem menuItem)
        {
            return new MenuItemDto
            {
                Id = menuItem.Id,
                Title = menuItem.Title,
                Url = menuItem.Url,
                Order = menuItem.Order,
                ParentId = menuItem.ParentId,
                Translations = menuItem.Translations?
                    .Where(t => !t.IsDeleted)
                    .Select(t => new MenuItemTranslationDto
                    {
                        LanguageCode = t.Language.Code,
                        Title = t.Title
                    })
                    .ToList(),
                Children = menuItem.Children?
                    .Where(c => !c.IsDeleted)
                    .OrderBy(c => c.Order)
                    .Select(c => MapToDto(c))
                    .ToList()
            };
        }

        private async Task UpsertTranslationsAsync(int menuItemId, List<MenuItemTranslationUpsertDto>? translations)
        {
            if (translations == null)
                return;

            var existingTranslations = await _context.MenuItemTranslations
                .Where(mt => mt.MenuItemId == menuItemId)
                .ToListAsync();

            foreach (var translation in translations)
            {
                var languageCode = translation.LanguageCode?.Trim().ToLowerInvariant();
                if (string.IsNullOrWhiteSpace(languageCode))
                    continue;

                var language = await _context.Languages
                    .FirstOrDefaultAsync(l => l.Code != null && l.Code.ToLower() == languageCode && !l.IsDeleted);

                if (language == null)
                    throw new InvalidOperationException($"Language not found: {languageCode}");

                var existing = existingTranslations
                    .FirstOrDefault(mt => mt.LanguageId == language.Id && !mt.IsDeleted);

                var title = translation.Title?.Trim();

                if (string.IsNullOrWhiteSpace(title))
                {
                    if (existing != null)
                    {
                        existing.IsDeleted = true;
                        existing.UpdatedDate = DateTime.UtcNow;
                    }

                    continue;
                }

                if (existing != null)
                {
                    existing.Title = title;
                    existing.UpdatedDate = DateTime.UtcNow;
                }
                else
                {
                    _context.MenuItemTranslations.Add(new MenuItemTranslation
                    {
                        MenuItemId = menuItemId,
                        LanguageId = language.Id,
                        Title = title,
                        CreatedDate = DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
