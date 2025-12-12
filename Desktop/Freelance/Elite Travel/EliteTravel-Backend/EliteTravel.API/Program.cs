using EliteTravel.Core.Repositories;
using EliteTravel.Core.Services;
using EliteTravel.Core.UnitOfWork;
using EliteTravel.Data.Contexts;
using EliteTravel.Data.Repositories;
using EliteTravel.Data.UnitOfWork;
using EliteTravel.Service.Mapping;
using EliteTravel.Service.Services;
using Microsoft.EntityFrameworkCore;
using EliteTravel.Core.Entities;
using EliteTravel.Core.DTOs;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. CORS AYARI (React ile İletişim İçin ŞART)
// ==========================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        b =>
        {
            b.AllowAnyOrigin()  // Her yerden gelen isteğe izin ver (localhost:5173 vs)
             .AllowAnyMethod()  // GET, POST, PUT, DELETE hepsine izin ver
             .AllowAnyHeader(); // Tüm başlıklara izin ver
        });
});

// 2. Controller'ları ekle
builder.Services.AddControllers();

// 3. Swagger/OpenAPI ekle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. Veritabanı Bağlantısı
builder.Services.AddDbContext<AppDbContext>(x =>
{
    x.UseSqlServer(builder.Configuration.GetConnectionString("SqlConnection"), option =>
    {
        option.MigrationsAssembly("EliteTravel.Data");
    });
});

// 5. BAĞIMLILIKLAR (Dependency Injection)

// UnitOfWork & Generic Repository
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// Generic Service
builder.Services.AddScoped(typeof(IService<,>), typeof(Service<,>));

// --- ÖZEL SERVİSLER ---
// Tour
builder.Services.AddScoped<ITourService, TourService>();
builder.Services.AddScoped<IService<Tour, TourDto>, TourService>(); // Generic imza için

// Booking
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IService<Booking, BookingDto>, BookingService>();

// Guide
builder.Services.AddScoped<IGuideService, GuideService>();
builder.Services.AddScoped<IService<Guide, GuideDto>, GuideService>();

// User
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IService<User, UserDto>, UserService>();

// Itinerary
builder.Services.AddScoped<IItineraryService, ItineraryService>();
builder.Services.AddScoped<IService<Itinerary, ItineraryDto>, ItineraryService>();

// TourExtra
builder.Services.AddScoped<ITourExtraService, TourExtraService>();
builder.Services.AddScoped<IService<TourExtra, TourExtraDto>, TourExtraService>();

// TourTranslation
builder.Services.AddScoped<ITourTranslationService, TourTranslationService>();
builder.Services.AddScoped<IService<TourTranslation, TourTranslationDto>, TourTranslationService>();

// Contact
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IService<Contact, ContactDto>, ContactService>();

// Language
builder.Services.AddScoped<ILanguageService, LanguageService>();
builder.Services.AddScoped<IService<Language, LanguageDto>, LanguageService>();

// MenuItem
builder.Services.AddScoped<IMenuItemService, MenuItemService>();
builder.Services.AddScoped<IService<MenuItem, MenuItemDto>, MenuItemService>();

// Page
builder.Services.AddScoped<IPageService, PageService>();
builder.Services.AddScoped<IService<Page, PageDto>, PageService>();

// 6. AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

var app = builder.Build();

// ==========================================
// PIPELINE (SIRASI ÖNEMLİ)
// ==========================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// >>> STATIC FILES (WWROOT) AYARI BURADA <<<
// Bu satır sayesinde "wwwroot" klasöründeki resimlere erişebileceğiz.
app.UseStaticFiles(); 

// CORS Middleware'i Static Files'dan sonra, Auth'dan önce gelir.
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();