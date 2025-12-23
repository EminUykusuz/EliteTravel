using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Data.Contexts;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResultDto<UserResponseDto>>> GetAll(
            [FromQuery] int pageNumber = 1, 
            [FromQuery] int pageSize = 10)
        {
            var users = await _context.Users
                .Where(u => !u.IsDeleted)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var totalCount = await _context.Users.Where(u => !u.IsDeleted).CountAsync();

            var userDtos = users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Role = u.Role,
                TwoFactorEnabled = u.TwoFAEnabled,
                CreatedDate = u.CreatedDate,
                UpdatedDate = u.UpdatedDate
            }).ToList();

            return Ok(new PaginatedResultDto<UserResponseDto>
            {
                Items = userDtos,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<UserResponseDto>>> GetById(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

            if (user == null)
                return NotFound(ApiResponseDto<UserResponseDto>.ErrorResponse("Kullanıcı bulunamadı"));

            var userDto = new UserResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                TwoFactorEnabled = user.TwoFAEnabled,
                CreatedDate = user.CreatedDate,
                UpdatedDate = user.UpdatedDate
            };

            return Ok(ApiResponseDto<UserResponseDto>.SuccessResponse(userDto, "Kullanıcı bulundu"));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<UserResponseDto>>> Create([FromBody] CreateUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<UserResponseDto>.ErrorResponse("Doğrulama başarısız"));

            // Email kontrolü
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && !u.IsDeleted);
            if (existingUser != null)
                return BadRequest(ApiResponseDto<UserResponseDto>.ErrorResponse("Bu email zaten kullanılıyor"));

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Role = dto.Role ?? "User",
                PasswordHash = HashPassword(dto.Password),
                CreatedDate = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDto = new UserResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                CreatedDate = user.CreatedDate
            };

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, 
                ApiResponseDto<UserResponseDto>.SuccessResponse(userDto, "Kullanıcı başarıyla oluşturuldu"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<UserResponseDto>>> Update(int id, [FromBody] UpdateUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponseDto<UserResponseDto>.ErrorResponse("Doğrulama başarısız"));

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
            if (user == null)
                return NotFound(ApiResponseDto<UserResponseDto>.ErrorResponse("Kullanıcı bulunamadı"));

            // Email kontrol et (başka kullanıcı tarafından kullanılmıyorsa)
            if (user.Email != dto.Email)
            {
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && !u.IsDeleted);
                if (existingUser != null)
                    return BadRequest(ApiResponseDto<UserResponseDto>.ErrorResponse("Bu email zaten kullanılıyor"));
            }

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.Role = dto.Role ?? user.Role;
            user.UpdatedDate = DateTime.Now;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            var userDto = new UserResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                CreatedDate = user.CreatedDate,
                UpdatedDate = user.UpdatedDate
            };

            return Ok(ApiResponseDto<UserResponseDto>.SuccessResponse(userDto, "Kullanıcı başarıyla güncellendi"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
            if (user == null)
                return NotFound(ApiResponseDto<bool>.ErrorResponse("Kullanıcı bulunamadı"));

            // Soft delete
            user.IsDeleted = true;
            user.UpdatedDate = DateTime.Now;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(ApiResponseDto<bool>.SuccessResponse(true, "Kullanıcı başarıyla silindi"));
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}