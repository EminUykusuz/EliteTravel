using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Entities;
using EliteTravel.Data.Contexts;

namespace EliteTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<BookingsController> _logger;

        public BookingsController(AppDbContext context, ILogger<BookingsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResultDto<BookingResponseDto>>> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? status = null,
            [FromQuery] int? userId = null)
        {
            try
            {
                var query = _context.Bookings
                    .Include(b => b.Tour)
                    .Include(b => b.User)
                    .Where(b => b.IsActive)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(b => b.Status == status);

                if (userId.HasValue)
                    query = query.Where(b => b.UserId == userId.Value);

                var totalCount = await query.CountAsync();
                var bookings = await query
                    .OrderByDescending(b => b.CreatedDate)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var response = bookings.Select(b => MapToResponseDto(b)).ToList();

                return Ok(new PaginatedResultDto<BookingResponseDto>
                {
                    Items = response,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting bookings");
                return StatusCode(500, ApiResponseDto<BookingResponseDto>.ErrorResponse("Internal server error"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<BookingResponseDto>>> GetById(int id)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.Tour)
                    .Include(b => b.User)
                    .FirstOrDefaultAsync(b => b.Id == id && b.IsActive);

                if (booking == null)
                    return NotFound(ApiResponseDto<BookingResponseDto>.ErrorResponse("Booking not found"));

                return Ok(ApiResponseDto<BookingResponseDto>.SuccessResponse(MapToResponseDto(booking), "Booking found"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting booking by id");
                return StatusCode(500, ApiResponseDto<BookingResponseDto>.ErrorResponse("Internal server error"));
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<PaginatedResultDto<BookingResponseDto>>> GetByUserId(
            int userId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.Bookings
                    .Include(b => b.Tour)
                    .Include(b => b.User)
                    .Where(b => b.UserId == userId && b.IsActive);

                var totalCount = await query.CountAsync();
                var bookings = await query
                    .OrderByDescending(b => b.CreatedDate)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var response = bookings.Select(b => MapToResponseDto(b)).ToList();

                return Ok(new PaginatedResultDto<BookingResponseDto>
                {
                    Items = response,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting bookings by user");
                return StatusCode(500, ApiResponseDto<BookingResponseDto>.ErrorResponse("Internal server error"));
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<BookingResponseDto>>> Create([FromBody] CreateBookingDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponseDto<BookingResponseDto>.ErrorResponse("Validation failed"));

                // Check if tour exists
                var tour = await _context.Tours.FindAsync(dto.TourId);
                if (tour == null)
                    return NotFound(ApiResponseDto<BookingResponseDto>.ErrorResponse("Tour not found"));

                // Check tour capacity
                var existingBookingsCount = await _context.Bookings
                    .Where(b => b.TourId == dto.TourId && b.BookingDate.Date == dto.BookingDate.Date && b.Status != "Cancelled")
                    .SumAsync(b => b.NumberOfPeople);

                if (existingBookingsCount + dto.NumberOfPeople > tour.Capacity)
                    return BadRequest(ApiResponseDto<BookingResponseDto>.ErrorResponse("Tour capacity exceeded"));

                var booking = new Booking
                {
                    UserId = dto.UserId,
                    TourId = dto.TourId,
                    FullName = dto.FullName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    NumberOfPeople = dto.NumberOfPeople,
                    BookingDate = dto.BookingDate,
                    TotalPrice = dto.TotalPrice,
                    Status = dto.Status ?? "Pending",
                    SpecialRequests = dto.SpecialRequests,
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow
                };

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();

                // Reload with includes
                booking = await _context.Bookings
                    .Include(b => b.Tour)
                    .Include(b => b.User)
                    .FirstOrDefaultAsync(b => b.Id == booking.Id);

                _logger.LogInformation($"Booking created: ID={booking!.Id}, Tour={dto.TourId}, Guest={dto.FullName}");

                return CreatedAtAction(nameof(GetById), new { id = booking.Id },
                    ApiResponseDto<BookingResponseDto>.SuccessResponse(MapToResponseDto(booking), "Booking created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating booking");
                return StatusCode(500, ApiResponseDto<BookingResponseDto>.ErrorResponse("Internal server error"));
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<BookingResponseDto>>> Update(int id, [FromBody] UpdateBookingDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponseDto<BookingResponseDto>.ErrorResponse("Validation failed"));

                if (id != dto.Id)
                    return BadRequest(ApiResponseDto<BookingResponseDto>.ErrorResponse("ID mismatch"));

                var booking = await _context.Bookings.FindAsync(id);
                if (booking == null)
                    return NotFound(ApiResponseDto<BookingResponseDto>.ErrorResponse("Booking not found"));

                // Update only provided fields
                if (!string.IsNullOrEmpty(dto.FullName))
                    booking.FullName = dto.FullName;

                if (!string.IsNullOrEmpty(dto.Email))
                    booking.Email = dto.Email;

                if (!string.IsNullOrEmpty(dto.Phone))
                    booking.Phone = dto.Phone;

                if (dto.NumberOfPeople.HasValue)
                    booking.NumberOfPeople = dto.NumberOfPeople.Value;

                if (dto.BookingDate.HasValue)
                    booking.BookingDate = dto.BookingDate.Value;

                if (dto.TotalPrice.HasValue)
                    booking.TotalPrice = dto.TotalPrice.Value;

                if (!string.IsNullOrEmpty(dto.Status))
                    booking.Status = dto.Status;

                if (dto.SpecialRequests != null)
                    booking.SpecialRequests = dto.SpecialRequests;

                if (dto.IsActive.HasValue)
                    booking.IsActive = dto.IsActive.Value;

                booking.UpdatedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Reload with includes
                booking = await _context.Bookings
                    .Include(b => b.Tour)
                    .Include(b => b.User)
                    .FirstOrDefaultAsync(b => b.Id == id);

                return Ok(ApiResponseDto<BookingResponseDto>.SuccessResponse(MapToResponseDto(booking!), "Booking updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating booking");
                return StatusCode(500, ApiResponseDto<BookingResponseDto>.ErrorResponse("Internal server error"));
            }
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ApiResponseDto<BookingResponseDto>>> UpdateStatus(
            int id,
            [FromBody] UpdateStatusDto dto)
        {
            try
            {
                var booking = await _context.Bookings.FindAsync(id);
                if (booking == null)
                    return NotFound(ApiResponseDto<BookingResponseDto>.ErrorResponse("Booking not found"));

                booking.Status = dto.Status;
                booking.UpdatedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Reload with includes
                booking = await _context.Bookings
                    .Include(b => b.Tour)
                    .Include(b => b.User)
                    .FirstOrDefaultAsync(b => b.Id == id);

                return Ok(ApiResponseDto<BookingResponseDto>.SuccessResponse(MapToResponseDto(booking!), "Status updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating booking status");
                return StatusCode(500, ApiResponseDto<BookingResponseDto>.ErrorResponse("Internal server error"));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            try
            {
                var booking = await _context.Bookings.FindAsync(id);
                if (booking == null)
                    return NotFound(ApiResponseDto<bool>.ErrorResponse("Booking not found"));

                // Soft delete
                booking.IsActive = false;
                booking.UpdatedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(ApiResponseDto<bool>.SuccessResponse(true, "Booking deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting booking");
                return StatusCode(500, ApiResponseDto<bool>.ErrorResponse("Internal server error"));
            }
        }

        private BookingResponseDto MapToResponseDto(Booking booking)
        {
            return new BookingResponseDto
            {
                Id = booking.Id,
                UserId = booking.UserId,
                TourId = booking.TourId,
                FullName = booking.FullName,
                Email = booking.Email,
                Phone = booking.Phone,
                NumberOfPeople = booking.NumberOfPeople,
                BookingDate = booking.BookingDate,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                SpecialRequests = booking.SpecialRequests,
                IsActive = booking.IsActive,
                CreatedDate = booking.CreatedDate,
                UpdatedDate = booking.UpdatedDate,
                User = booking.User != null ? new UserResponseDto
                {
                    Id = booking.User.Id,
                    FirstName = booking.User.FirstName,
                    LastName = booking.User.LastName,
                    Email = booking.User.Email,
                    Role = booking.User.Role
                } : null,
                Tour = booking.Tour != null ? new TourListDto
                {
                    Id = booking.Tour.Id,
                    Title = booking.Tour.Title,
                    Price = booking.Tour.Price,
                    Currency = booking.Tour.Currency
                } : null
            };
        }
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}