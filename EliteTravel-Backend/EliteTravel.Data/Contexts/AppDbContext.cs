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
        public DbSet<MenuItemTranslation> MenuItemTranslations { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<TourCategory> TourCategories { get; set; }
        public DbSet<Settings> Settings { get; set; }

       protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

    // Decimal precision ayarı
    modelBuilder.Entity<Booking>()
        .Property(b => b.TotalPrice)
        .HasColumnType("decimal(18,2)");

    // Tour Price precision
    modelBuilder.Entity<Tour>()
        .Property(t => t.Price)
        .HasColumnType("decimal(18,2)");

    // TourExtra Price precision
    modelBuilder.Entity<TourExtra>()
        .Property(te => te.Price)
        .HasColumnType("decimal(18,2)");

    // Guide HireAmount precision
    modelBuilder.Entity<Guide>()
        .Property(g => g.HireAmount)
        .HasColumnType("decimal(18,2)");

    // Category self-referencing
    modelBuilder.Entity<Category>()
        .HasOne(c => c.Parent)
        .WithMany(c => c.Children)
        .HasForeignKey(c => c.ParentId)
        .OnDelete(DeleteBehavior.Restrict);

    // TourCategory Many-to-Many
    modelBuilder.Entity<TourCategory>()
        .HasKey(tc => new { tc.TourId, tc.CategoryId });

    // MenuItemTranslations unique constraint
    modelBuilder.Entity<MenuItemTranslation>()
        .HasIndex(mt => new { mt.MenuItemId, mt.LanguageId })
        .IsUnique();

    modelBuilder.Entity<TourCategory>()
        .HasOne(tc => tc.Tour)
        .WithMany(t => t.TourCategories)
        .HasForeignKey(tc => tc.TourId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<TourCategory>()
        .HasOne(tc => tc.Category)
        .WithMany(c => c.TourCategories)
        .HasForeignKey(tc => tc.CategoryId)
        .OnDelete(DeleteBehavior.Cascade);
}
    }
}