using EliteTravel.Data.Contexts;
using EliteTravel.Core.Entities;
using EliteTravel.Core.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Load appsettings.local.json if exists
builder.Configuration.AddJsonFile("appsettings.local.json", optional: true, reloadOnChange: true);

// 1. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", b =>
    {
        b.AllowAnyOrigin()
         .AllowAnyMethod()
         .AllowAnyHeader();
    });
});

// 2. Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// 3. Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
});

// 4. Database
builder.Services.AddDbContext<AppDbContext>(x =>
{
    x.UseSqlServer(builder.Configuration.GetConnectionString("SqlConnection"), option =>
    {
        option.MigrationsAssembly("EliteTravel.Data");
    });
});

// 5. Email Service
builder.Services.AddScoped<IEmailService, EmailService>();

var app = builder.Build();

// Seed test data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Veritabanını oluştur (migration'ları çalıştır)
    context.Database.Migrate();

    // Seed languages (eğer yoksa)
    if (!context.Languages.Any(l => !l.IsDeleted))
    {
        context.Languages.AddRange(
            new Language { Code = "tr", Name = "Türkçe", Icon = "🇹🇷", CreatedDate = DateTime.UtcNow, IsDeleted = false },
            new Language { Code = "en", Name = "English", Icon = "🇬🇧", CreatedDate = DateTime.UtcNow, IsDeleted = false },
            new Language { Code = "de", Name = "Deutsch", Icon = "🇩🇪", CreatedDate = DateTime.UtcNow, IsDeleted = false },
            new Language { Code = "nl", Name = "Nederlands", Icon = "🇳🇱", CreatedDate = DateTime.UtcNow, IsDeleted = false }
        );
        context.SaveChanges();
    }

    // Seed data ekle (eğer yoksa)
    if (!context.Tours.Any())
    {
        var guide1 = new Guide 
        { 
            Name = "Dr. Ahmet Anapalı", 
            Specialization = "Osmanlı Tarihi", 
            PhoneNumber = "+905051234567",
            IsActive = true,
            CreatedDate = DateTime.UtcNow
        };
        var guide2 = new Guide 
        { 
            Name = "Mimar Murat", 
            Specialization = "Mimarisi", 
            PhoneNumber = "+905067890123",
            IsActive = true,
            CreatedDate = DateTime.UtcNow
        };

        context.Guides.Add(guide1);
        context.Guides.Add(guide2);
        context.SaveChanges();

        var cat1 = new Category 
        { 
            Name = "Osmanlı Başkentleri",
            Description = "Osmanlı Devletinin başkent şehirlerini ziyaret eden turlar",
            IsActive = true,
            CreatedDate = DateTime.UtcNow
        };
        var cat2 = new Category 
        { 
            Name = "Osmanlı Mimarisi",
            Description = "Mimar Sinan ve Osmanlı mimarisinin yer aldığı turlar",
            IsActive = true,
            CreatedDate = DateTime.UtcNow
        };
        var cat3 = new Category 
        { 
            Name = "Maneviyat Turları",
            Description = "Manevi ve dini değerleri içeren turlar",
            IsActive = true,
            CreatedDate = DateTime.UtcNow
        };

        context.Categories.AddRange(cat1, cat2, cat3);
        context.SaveChanges();

        // Tour 1: Bursa & Söğüt
        var tour1 = new Tour
        {
            Title = "Dr. Ahmet Anapalı ile Osmanlı Başkentleri: Bursa & Söğüt",
            Slug = "ottoman-capitals-november-2025",
            Description = "Sultanların izinde, Düsseldorf çıkışlı, tarih ve maneviyat dolu 6 günlük eşsiz bir bakış açısı yolculuğu.",
            Price = 850,
            Currency = "EUR",
            Capacity = 25,
            MainImage = "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a6b?w=1920&q=80",
            Thumbnail = "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
            IsActive = true,
            GuideId = guide1.Id,
            CreatedDate = DateTime.UtcNow
        };

        // Tour 2: Edirne & İstanbul
        var tour2 = new Tour
        {
            Title = "Mimar Sinan'ın İzinde: Edirne & İstanbul",
            Slug = "mimar-sinan-edirne-istanbul-december-2025",
            Description = "Osmanlı'nın Avrupa'ya açılan kapısı Edirne ve Mimar Sinan'ın ustalık eseri Selimiye'nin gölgesinde bir yolculuk.",
            Price = 790,
            Currency = "EUR",
            Capacity = 20,
            MainImage = "https://images.unsplash.com/photo-1622587676646-0b44d32049e7?w=1920&q=80",
            Thumbnail = "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
            IsActive = true,
            GuideId = guide2.Id,
            CreatedDate = DateTime.UtcNow
        };

        // Tour 3: Kudüs
        var tour3 = new Tour
        {
            Title = "Miracın Gölgesinde: Kudüs-ü Şerif",
            Slug = "jerusalem-spiritual-journey-2026",
            Description = "İlk kıblemiz Mescid-i Aksa'da Cuma namazı ve Peygamberler şehrinde manevi bir diriliş.",
            Price = 1150,
            Currency = "EUR",
            Capacity = 15,
            MainImage = "https://images.unsplash.com/photo-1564998708761-a831e5f08577?w=1920&q=80",
            Thumbnail = "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
            IsActive = true,
            GuideId = guide1.Id,
            CreatedDate = DateTime.UtcNow
        };

        context.Tours.AddRange(tour1, tour2, tour3);
        context.SaveChanges();

        // Get Turkish language ID
        var trLanguage = context.Languages.FirstOrDefault(l => l.Code == "tr");
        
        // Add Turkish translations for tours
        if (trLanguage != null)
        {
            context.TourTranslations.AddRange(
                new TourTranslation 
                { 
                    TourId = tour1.Id, 
                    LanguageId = trLanguage.Id, 
                    Title = "Dr. Ahmet Anapali ile Osmanlı Başkentleri: Bursa & Söğüt",
                    Description = "Sultanların izinde, Düsseldorf çıkışlı, tarih ve maneviyat dolu 6 günlük eşsiz bir bakış açısı yolculuğu.",
                    Slug = "ottoman-capitals-november-2025"
                },
                new TourTranslation 
                { 
                    TourId = tour2.Id, 
                    LanguageId = trLanguage.Id, 
                    Title = "Mimar Sinan'ın İzinde: Edirne & İstanbul",
                    Description = "Osmanlı'nın Avrupa'ya açılan kapısı Edirne ve Mimar Sinan'ın ustalık eseri Selimiye'nin gölgesinde bir yolculuk.",
                    Slug = "mimar-sinan-edirne-istanbul-december-2025"
                },
                new TourTranslation 
                { 
                    TourId = tour3.Id, 
                    LanguageId = trLanguage.Id, 
                    Title = "Miracın Gölgesinde: Kudüs-ü Şerif",
                    Description = "İlk kıblemiz Mescid-i Aksa'da Cuma namazı ve Peygamberler şehrinde manevi bir diriliş.",
                    Slug = "jerusalem-spiritual-journey-2026"
                }
            );
            context.SaveChanges();
        }

        // Add Itineraries for Tour 1
        context.Itineraries.AddRange(
            new Itinerary { TourId = tour1.Id, DayNumber = 1, Title = "Kuruluşun Toprakları", Description = "07:30 PC 1006 ile İstanbul'a varış. Söğüt'e transfer, Ertuğrul Gazi ziyareti ve Bursa'ya geçiş.", IsDeleted = false, CreatedDate = DateTime.UtcNow },
            new Itinerary { TourId = tour1.Id, DayNumber = 2, Title = "Ulu Şehir Bursa", Description = "Osman Gazi, Orhan Gazi, Yeşil Türbe, Ulu Camii, Panorama 1326 ve Emir Sultan.", IsDeleted = false, CreatedDate = DateTime.UtcNow },
            new Itinerary { TourId = tour1.Id, DayNumber = 3, Title = "Dersaadet İstanbul", Description = "Yedikule, Panorama 1453, Topkapı Sarayı ve Ayasofya-i Kebir.", IsDeleted = false, CreatedDate = DateTime.UtcNow },
            new Itinerary { TourId = tour1.Id, DayNumber = 4, Title = "Sultanların İstanbul'u", Description = "II. Abdülhamid Han, Süleymaniye, Fatih Camii, Eyüp Sultan ve Cülus Yolu.", IsDeleted = false, CreatedDate = DateTime.UtcNow },
            new Itinerary { TourId = tour1.Id, DayNumber = 5, Title = "Saraylar ve Boğaz", Description = "Dolmabahçe Sarayı, Barbaros Hayreddin Paşa ve Yıldız Sarayı.", IsDeleted = false, CreatedDate = DateTime.UtcNow },
            new Itinerary { TourId = tour1.Id, DayNumber = 6, Title = "Veda", Description = "Serbest zaman sonrası havalimanı transferi. 17:35 PC 1005 ile Düsseldorf'a dönüş.", IsDeleted = false, CreatedDate = DateTime.UtcNow }
        );

        // Add Itineraries for Tour 2
        context.Itineraries.AddRange(
            new Itinerary { TourId = tour2.Id, DayNumber = 1, Title = "Serhat Şehri'ne Yolculuk", Description = "İstanbul Havalimanı'nda karşılama ve özel araçlarla Edirne'ye hareket. Otele yerleşme ve akşam Meriç Nehri kenarında çay keyfi.", IsDeleted = false, CreatedDate = DateTime.UtcNow },
            new Itinerary { TourId = tour2.Id, DayNumber = 2, Title = "Mimar Sinan'ın Ustalığı", Description = "Dünya mimarlık tarihinin zirvesi Selimiye Camii, Üç Şerefeli Camii ve yazılarıyla ünlü Eski Camii ziyareti. Öğle yemeğinde meşhur Edirne ciğeri ikramı.", IsDeleted = false, CreatedDate = DateTime.UtcNow },
            new Itinerary { TourId = tour2.Id, DayNumber = 3, Title = "Şifanın Tarihi ve Karaağaç", Description = "Avrupa Konseyi ödüllü II. Bayezid Sağlık Müzesi (Darüşşifa), Lozan Anıtı ve Karaağaç Tren İstasyonu gezisi.", IsDeleted = false, CreatedDate = DateTime.UtcNow },
            new Itinerary { TourId = tour2.Id, DayNumber = 4, Title = "İstanbul'a Dönüş ve Eyüp Sultan", Description = "Sabah kahvaltısı sonrası İstanbul'a dönüş. Eyüp Sultan Hazretleri ziyareti ve Pierre Loti tepesinde Haliç manzarası.", IsDeleted = false, CreatedDate = DateTime.UtcNow },
            new Itinerary { TourId = tour2.Id, DayNumber = 5, Title = "Boğaz'ın İncileri ve Veda", Description = "Tekne ile Boğaz turu, Ortaköy ve Eminönü Mısır Çarşısı gezisi sonrası havalimanına transfer.", IsDeleted = false, CreatedDate = DateTime.UtcNow }
        );

        // Add Itineraries for Tour 3
        context.Itineraries.AddRange(
            new Itinerary { TourId = tour3.Id, DayNumber = 1, Title = "Kutsal Topraklara Vuslat", Description = "Tel Aviv Havalimanı'na varış ve Kudüs'e transfer. Mescid-i Aksa'da ilk ikindi namazı ve Burak Duvarı ziyareti.", IsDeleted = false, CreatedDate = DateTime.UtcNow },
            new Itinerary { TourId = tour3.Id, DayNumber = 2, Title = "Peygamberler Şehri", Description = "Zeytin Dağı'ndan Kudüs panoraması, Selman-ı Farisi ve Rabia-tül Adeviyye makamları. Akşam Mescid-i Aksa'da sohbet.", IsDeleted = false, CreatedDate = DateTime.UtcNow },
            new Itinerary { TourId = tour3.Id, DayNumber = 3, Title = "El-Halil ve Hz. İbrahim", Description = "El-Halil kentine hareket. Hz. İbrahim, Hz. İshak, Hz. Yakup ve zevcelerinin kabirlerini ziyaret. Beytüllahim gezisi.", IsDeleted = false, CreatedDate = DateTime.UtcNow },
            new Itinerary { TourId = tour3.Id, DayNumber = 4, Title = "Eski Şehir ve Cuma Namazı", Description = "Kudüs sur içi, Kıyamet Kilisesi, Hz. Ömer Camii gezileri. Mescid-i Aksa avlusunda Cuma namazı heyecanı.", IsDeleted = false, CreatedDate = DateTime.UtcNow },
            new Itinerary { TourId = tour3.Id, DayNumber = 5, Title = "Yafa ve Dönüş", Description = "Osmanlı mirası Yafa şehri, Sultan Abdülhamid Saat Kulesi ve Bahriye Camii ziyareti sonrası havalimanına transfer.", IsDeleted = false, CreatedDate = DateTime.UtcNow }
        );

        // TourCategories
        context.TourCategories.AddRange(
            new TourCategory { TourId = tour1.Id, CategoryId = cat1.Id },
            new TourCategory { TourId = tour2.Id, CategoryId = cat2.Id },
            new TourCategory { TourId = tour3.Id, CategoryId = cat3.Id }
        );

        context.SaveChanges();
    }

    // Menü öğelerini ekle (eğer yoksa)
    if (!context.MenuItems.Any())
    {
        // Parent menü items
        var menuAnaPage = new MenuItem { Title = "Home", Url = "/", Order = 1, IsDeleted = false, CreatedDate = DateTime.UtcNow, ParentId = null };
        var menuTurlar = new MenuItem { Title = "Tours", Url = "/tours", Order = 2, IsDeleted = false, CreatedDate = DateTime.UtcNow, ParentId = null };
        var menuKurumsal = new MenuItem { Title = "About Us", Url = "/about", Order = 3, IsDeleted = false, CreatedDate = DateTime.UtcNow, ParentId = null };
        var menuIletisim = new MenuItem { Title = "Contact", Url = "/contact", Order = 4, IsDeleted = false, CreatedDate = DateTime.UtcNow, ParentId = null };

        context.MenuItems.AddRange(menuAnaPage, menuTurlar, menuKurumsal, menuIletisim);
        context.SaveChanges();

        // Tours submenu items
        context.MenuItems.AddRange(
            new MenuItem { Title = "Ottoman Capitals", Url = "/tours?category=ottoman-capitals", Order = 1, IsDeleted = false, CreatedDate = DateTime.UtcNow, ParentId = menuTurlar.Id },
            new MenuItem { Title = "Ottoman Architecture", Url = "/tours?category=ottoman-architecture", Order = 2, IsDeleted = false, CreatedDate = DateTime.UtcNow, ParentId = menuTurlar.Id },
            new MenuItem { Title = "Spiritual Tours", Url = "/tours?category=spiritual-tours", Order = 3, IsDeleted = false, CreatedDate = DateTime.UtcNow, ParentId = menuTurlar.Id }
        );

        context.SaveChanges();

        // Settings - Sosyal medya ve site ayarları
        var defaultSettings = new Settings
        {
            SiteName = "Elite Travel",
            SiteEmail = "info@elitetravel.com",
            SitePhone = "+31 6 21525757",
            Address = "Fuar Alanı: Salon 3, Stant B-12, İstanbul / Türkiye",
            MetaTitle = "Elite Travel - Osmanlı Mirası Turları",
            MetaDescription = "Dr. Ahmet Anapalı rehberliğinde tarih ve maneviyat dolu özel rotalarla konforlu bir keşif deneyimi.",
            MetaKeywords = "tur, osmanlı, maneviyat, rehberli tur, İstanbul, Bursa",
            GoogleAnalytics = "",
            FacebookPixel = "",
            InstagramUrl = "https://www.instagram.com/elitetravelnl/",
            FacebookUrl = "",
            TwitterUrl = "",
            YoutubeUrl = "",
            CreatedDate = DateTime.UtcNow
        };

        context.Settings.Add(defaultSettings);
        context.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();