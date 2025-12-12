using Microsoft.EntityFrameworkCore;
using EliteTravel.Core.Entities;
using System.Reflection;

namespace EliteTravel.Data.Contexts
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets - Tablo Tanımları
        public DbSet<Tour> Tours { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Guide> Guides { get; set; }
        public DbSet<Itinerary> Itineraries { get; set; }
        public DbSet<TourExtra> TourExtras { get; set; }
        public DbSet<TourTranslation> TourTranslations { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Tüm Entity konfigürasyonlarını (Validation, İlişkiler vs.) Assembly'den yükle
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            base.OnModelCreating(modelBuilder);
        }
    }
}