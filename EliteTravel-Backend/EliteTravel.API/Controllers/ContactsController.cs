using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Data.Contexts;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Text.Json;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseDto<PaginatedResultDto<ContactResponseDto>>>> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? isRead = null)
        {
            var query = _context.Contacts.AsQueryable();

            if (isRead.HasValue)
            {
                query = query.Where(c => c.IsRead == isRead.Value);
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(c => c.CreatedDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new ContactResponseDto
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    Phone = c.Phone,
                    Message = c.Message,
                    IsRead = c.IsRead,
                    ReplyMessage = c.ReplyMessage,
                    CreatedDate = c.CreatedDate,
                    RepliedDate = c.RepliedDate
                })
                .ToListAsync();

            var paginatedResult = new PaginatedResultDto<ContactResponseDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            return Ok(ApiResponseDto<PaginatedResultDto<ContactResponseDto>>.SuccessResponse(paginatedResult, "Messages retrieved successfully"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<ContactResponseDto>>> GetById(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
                return NotFound(ApiResponseDto<ContactResponseDto>.ErrorResponse("Contact not found"));

            contact.IsRead = true;
            await _context.SaveChangesAsync();

            var dto = new ContactResponseDto
            {
                Id = contact.Id,
                FirstName = contact.FirstName,
                LastName = contact.LastName,
                Email = contact.Email,
                Phone = contact.Phone,
                Message = contact.Message,
                IsRead = contact.IsRead,
                ReplyMessage = contact.ReplyMessage,
                CreatedDate = contact.CreatedDate,
                RepliedDate = contact.RepliedDate
            };

            return Ok(ApiResponseDto<ContactResponseDto>.SuccessResponse(dto, "Contact found"));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<ContactResponseDto>>> Create([FromBody] CreateContactDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<ContactResponseDto>.ErrorResponse("Validation failed"));

            // Verify reCAPTCHA token
            try
            {
                var client = new HttpClient();
                var recaptchaSecret = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; // Test key - güncelleyin!
                
                var response = await client.PostAsync(
                    $"https://www.google.com/recaptcha/api/siteverify",
                    new FormUrlEncodedContent(new Dictionary<string, string>
                    {
                        { "secret", recaptchaSecret },
                        { "response", dto.RecaptchaToken }
                    }));

                var content = await response.Content.ReadAsStringAsync();
                var jsonDoc = JsonDocument.Parse(content);
                var root = jsonDoc.RootElement;
                
                var success = root.GetProperty("success").GetBoolean();
                var score = root.GetProperty("score").GetDouble();

                // Score 0.5 altındaysa spam olabilir
                if (!success || score < 0.5)
                    return BadRequest(ApiResponseDto<ContactResponseDto>.ErrorResponse("reCAPTCHA verification failed"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseDto<ContactResponseDto>.ErrorResponse($"reCAPTCHA error: {ex.Message}"));
            }

            var contact = new Contact
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                Message = dto.Message,
                IsRead = false,
                CreatedDate = DateTime.UtcNow
            };

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            var responseDto = new ContactResponseDto
            {
                Id = contact.Id,
                FirstName = contact.FirstName,
                LastName = contact.LastName,
                Email = contact.Email,
                Phone = contact.Phone,
                Message = contact.Message,
                IsRead = contact.IsRead,
                CreatedDate = contact.CreatedDate
            };

            return CreatedAtAction(nameof(GetById), new { id = contact.Id },
                ApiResponseDto<ContactResponseDto>.SuccessResponse(responseDto, "Contact message received"));
        }

        [HttpPost("{id}/reply")]
        public async Task<ActionResult<ApiResponseDto<ContactResponseDto>>> Reply(int id, [FromBody] ReplyContactDto dto)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
                return NotFound(ApiResponseDto<ContactResponseDto>.ErrorResponse("Contact not found"));

            contact.ReplyMessage = dto.ReplyMessage;
            contact.RepliedDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var responseDto = new ContactResponseDto
            {
                Id = contact.Id,
                FirstName = contact.FirstName,
                LastName = contact.LastName,
                Email = contact.Email,
                Phone = contact.Phone,
                Message = contact.Message,
                IsRead = contact.IsRead,
                ReplyMessage = contact.ReplyMessage,
                CreatedDate = contact.CreatedDate,
                RepliedDate = contact.RepliedDate
            };

            return Ok(ApiResponseDto<ContactResponseDto>.SuccessResponse(responseDto, "Reply sent"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<object>>> Delete(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
                return NotFound(ApiResponseDto<object>.ErrorResponse("Contact not found"));

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return Ok(ApiResponseDto<object>.SuccessResponse(null, "Contact deleted"));
        }
    }
}