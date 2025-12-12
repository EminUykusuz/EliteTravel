using Microsoft.AspNetCore.Mvc;
using EliteTravel.Core.Entities;
using EliteTravel.Core.DTOs;
using EliteTravel.Core.Services;
using System.Threading.Tasks; // Asenkron işlemler (Task) için gerekli

namespace EliteTravel.API.Controllers
{
    // [Route]: Tarayıcıdaki adres çubuğunda bu servise nasıl ulaşılacağını belirler.
    // Örn: https://site.com/api/bookings
    [Route("api/[controller]")]
    
    // [ApiController]: Bu sınıfın bir API olduğunu belirtir, otomatik doğrulama yapar.
    [ApiController]
    public class BookingsController : ControllerBase
    {
        // Dependency Injection (Bağımlılık Enjeksiyonu):
        // Controller'ın çalışması için "Service" katmanına ihtiyacı var.
        // Biz burada "New" diyerek nesne oluşturmuyoruz, sistemden bize hazır bir servis vermesini istiyoruz.
        private readonly IService<Booking, BookingDto> _service;

        // Constructor (Kurucu Metot):
        // Sınıf oluşturulduğunda ilk burası çalışır ve servisi içeri alır.
        // DİKKAT: Metot adı "BookingsController" olmak zorundadır (Sınıf ismiyle aynı).
        public BookingsController(IService<Booking, BookingDto> service)
        {
            _service = service;
        }

        // GET: api/bookings
        // Tüm rezervasyonları listeler.
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Servise git ve tüm datayı çek
            var bookings = await _service.GetAllAsync();
            
            // 200 OK koduyla veriyi geri dön
            return Ok(bookings);
        }

        // GET: api/bookings/5
        // Sadece ID'si 5 olan rezervasyonu getirir.
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var booking = await _service.GetByIdAsync(id);
            return Ok(booking);
        }

        // POST: api/bookings
        // Yeni bir rezervasyon kaydeder.
        [HttpPost]
        public async Task<IActionResult> Save(BookingDto bookingDto)
        {
            // Servise "Ekle" emri veriyoruz.
            // Kapasite kontrolü (RemainingSlots) iş mantığı Service katmanında yapılacak.
            var newBooking = await _service.AddAsync(bookingDto);

            // İşlem başarılı olursa 201 Created döner ve oluşturulan veriyi gösterir.
            return CreatedAtAction(nameof(GetById), new { id = newBooking.Id }, newBooking);
        }

        // PUT: api/bookings/5
        // Var olan rezervasyonu günceller.
        // HATA ÇIKAN YER GENELDE BURASIYDI: Hem ID'yi hem DTO'yu almamız lazım.
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BookingDto bookingDto)
        {
            // Servisteki Update metoduna hem yeni veriyi hem de hangi ID olduğunu söylüyoruz.
            await _service.UpdateAsync(bookingDto, id);

            // Güncelleme işleminden sonra genelde veri dönülmez, 204 No Content (Başarılı ama içerik yok) dönülür.
            return NoContent();
        }

        // DELETE: api/bookings/5
        // Rezervasyonu siler.
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            await _service.RemoveAsync(id);
            
            // Silme işlemi başarılıysa 204 döner.
            return NoContent();
        }
    }
}