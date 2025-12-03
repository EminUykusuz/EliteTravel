// Data/UykusuzPenDbContext.cs
using Microsoft.EntityFrameworkCore;
using UykusuzPenApi.Models;

namespace UykusuzPenApi.Data
{
    public class UykusuzPenDbContext : DbContext
    {
        public UykusuzPenDbContext(DbContextOptions<UykusuzPenDbContext> options) : base(options) { }

        public DbSet<Kategori> Kategoriler { get; set; }
        public DbSet<Galeri> Galeri { get; set; }
        public DbSet<Renk> Renkler { get; set; }
        public DbSet<Urun> Urunler { get; set; }
        public DbSet<UrunResim> UrunResimleri { get; set; }
        public DbSet<UrunRenk> UrunRenkler { get; set; }
        public DbSet<IletisimMesaji> IletisimMesajlari { get; set; }
        public DbSet<Kullanici> Kullanicilar { get; set; }
        public DbSet<SeoAyari> SeoAyarlari { get; set; }
        public DbSet<SiteAyari> SiteAyarlari { get; set; }
        public DbSet<AdminUser> AdminUsers { get; set; }
        public DbSet<Blog> Bloglar { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ---------------------------------------------------
            // AdminUser (EKSİKTİ - EKLENDİ)
            // ---------------------------------------------------
            modelBuilder.Entity<AdminUser>(entity =>
            {
                entity.ToTable("admin_users");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserName).HasColumnName("user_name");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.FailedLoginCount).HasColumnName("failed_login_count"); // <-- HATA 2'NİN ÇÖZÜMÜ
                entity.Property(e => e.LockoutEnd).HasColumnName("lockout_end");
                entity.HasIndex(e => e.UserName).IsUnique();
            });

            // ---------------------------------------------------
            // Blog (HATALIYDI - DÜZELTİLDİ)
            // ---------------------------------------------------
            modelBuilder.Entity<Blog>(entity =>
            {
                entity.ToTable("bloglar"); // <-- HATA 1'İN ÇÖZÜMÜ ("Blog" değil "bloglar")
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Baslik).HasColumnName("baslik");
                entity.Property(e => e.Aciklama).HasColumnName("aciklama");
                entity.Property(e => e.ResimUrl).HasColumnName("resim_url");
                entity.Property(e => e.OlusturulmaTarihi).HasColumnName("olusturulma_tarihi");
            });

            // ---------------------------------------------------
            // Galeri (HATALIYDI ve EKSİKTİ - DÜZELTİLDİ)
            // ---------------------------------------------------
            modelBuilder.Entity<Galeri>(entity =>
            {
                entity.ToTable("galeri");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Baslik).HasColumnName("baslik");
                entity.Property(e => e.Slug).HasColumnName("slug");
                entity.Property(e => e.Aciklama).HasColumnName("aciklama");
                entity.Property(e => e.KategoriId).HasColumnName("kategori_id");
                entity.Property(e => e.Il).HasColumnName("il");
                entity.Property(e => e.Ilce).HasColumnName("ilce");
                entity.Property(e => e.MedyaTipi).HasColumnName("medya_tipi");
                entity.Property(e => e.MedyaYolu).HasColumnName("medya_yolu");
                entity.Property(e => e.KapakResmi).HasColumnName("kapak_resmi");
                entity.Property(e => e.AltText).HasColumnName("alt_text"); // <-- HATA 3'ÜN ÇÖZÜMÜ ("AltText" değil "alt_text")

                // İlişki
                entity.HasOne(g => g.Kategori)
                      .WithMany(k => k.Galeriler)
                      .HasForeignKey(g => g.KategoriId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // ---------------------------------------------------
            // Kategori (Eksikleri tamamlandı)
            // ---------------------------------------------------
            modelBuilder.Entity<Kategori>(entity =>
            {
                entity.ToTable("kategoriler");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.KategoriAdi).HasColumnName("kategori_adi");
                entity.Property(e => e.UstKategoriId).HasColumnName("ust_kategori_id");
                entity.Property(e => e.Slug).HasColumnName("slug");
                entity.Property(e => e.Aciklama).HasColumnName("aciklama");

                entity.HasOne(k => k.UstKategori)
                      .WithMany(k => k.AltKategoriler)
                      .HasForeignKey(k => k.UstKategoriId)
                      .OnDelete(DeleteBehavior.SetNull); // Cascade yerine SetNull daha güvenli
                      
                entity.HasIndex(k => k.Slug).IsUnique();
            });
            
            // ---------------------------------------------------
            // Renk (EKSİKTİ - EKLENDİ)
            // ---------------------------------------------------
            modelBuilder.Entity<Renk>(entity =>
            {
                entity.ToTable("renkler");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.RenkAdi).HasColumnName("renk_adi");
                entity.Property(e => e.KategoriId).HasColumnName("kategori_id");
                
                entity.HasOne(r => r.Kategori)
                      .WithMany() // Kategori modelinde Renkler listesi yok, o yüzden boş
                      .HasForeignKey(r => r.KategoriId)
                      .OnDelete(DeleteBehavior.SetNull);
                      
                // entity.HasIndex(r => r.RenkAdi).IsUnique(); // Bunu kaldırdım, farklı kategorilerde aynı renk adı olabilir
            });

            // ---------------------------------------------------
            // Urun (EKSİKTİ - EKLENDİ)
            // ---------------------------------------------------
            modelBuilder.Entity<Urun>(entity =>
            {
                entity.ToTable("urunler");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UrunAdi).HasColumnName("urun_adi");
                entity.Property(e => e.Slug).HasColumnName("slug");
                entity.Property(e => e.Aciklama).HasColumnName("aciklama");
                entity.Property(e => e.KategoriId).HasColumnName("kategori_id");
                entity.Property(e => e.AnaResim).HasColumnName("ana_resim"); // <-- Diğer loglardaki hatanın çözümü

                entity.HasOne(u => u.Kategori)
                      .WithMany(k => k.Urunler)
                      .HasForeignKey(u => u.KategoriId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // ---------------------------------------------------
            // UrunResim (EKSİKTİ - EKLENDİ)
            // ---------------------------------------------------
            modelBuilder.Entity<UrunResim>(entity =>
            {
                entity.ToTable("urun_resimleri");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UrunId).HasColumnName("urun_id");
                entity.Property(e => e.ResimYolu).HasColumnName("resim_yolu");
                entity.Property(e => e.AltText).HasColumnName("alt_text");

                entity.HasOne(ur => ur.Urun)
                      .WithMany(u => u.UrunResimleri)
                      .HasForeignKey(ur => ur.UrunId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------------------------------------------------
            // UrunRenk (Eksikleri tamamlandı)
            // ---------------------------------------------------
            modelBuilder.Entity<UrunRenk>(entity =>
            {
                entity.ToTable("urun_renkler");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UrunId).HasColumnName("urun_id");
                entity.Property(e => e.RenkId).HasColumnName("renk_id");

                entity.HasOne(ur => ur.Urun)
                      .WithMany(u => u.UrunRenkler)
                      .HasForeignKey(ur => ur.UrunId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ur => ur.Renk)
                      .WithMany(r => r.UrunRenkler)
                      .HasForeignKey(ur => ur.RenkId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(ur => new { ur.UrunId, ur.RenkId }).IsUnique();
            });

            // ---------------------------------------------------
            // IletisimMesaji (EKSİKTİ - EKLENDİ)
            // ---------------------------------------------------
            modelBuilder.Entity<IletisimMesaji>(entity =>
            {
                entity.ToTable("iletisim_mesajlari");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.AdSoyad).HasColumnName("ad_soyad");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Telefon).HasColumnName("telefon");
                entity.Property(e => e.FirmaAdi).HasColumnName("firma_adi");
                entity.Property(e => e.IsTuru).HasColumnName("is_turu");
                entity.Property(e => e.Mesaj).HasColumnName("mesaj");
                entity.Property(e => e.Durum).HasColumnName("durum");
                entity.Property(e => e.Tarih).HasColumnName("tarih");
            });

            // ---------------------------------------------------
            // Kullanici (EKSİKTİ - EKLENDİ)
            // ---------------------------------------------------
             modelBuilder.Entity<Kullanici>(entity => 
             {
                entity.ToTable("kullanicilar");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.KullaniciAdi).HasColumnName("kullanici_adi");
                entity.Property(e => e.Sifre).HasColumnName("sifre");
                entity.Property(e => e.AdSoyad).HasColumnName("ad_soyad");
                entity.Property(e => e.Email).HasColumnName("email");
                
                entity.HasIndex(k => k.KullaniciAdi).IsUnique();
             });

            // ---------------------------------------------------
            // SeoAyari (Tamamlandı)
            // ---------------------------------------------------
            modelBuilder.Entity<SeoAyari>(entity =>
            {
                entity.ToTable("seo_ayarlari");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.SayfaTipi).HasColumnName("sayfa_tipi");
                entity.Property(e => e.SayfaId).HasColumnName("sayfa_id");
                entity.Property(e => e.Title).HasColumnName("title");
                entity.Property(e => e.MetaDescription).HasColumnName("meta_description");
                entity.Property(e => e.MetaKeywords).HasColumnName("meta_keywords");
                entity.Property(e => e.Aciklama).HasColumnName("aciklama");
                
                entity.HasIndex(s => new { s.SayfaTipi, s.SayfaId }).IsUnique();
            });

            // ---------------------------------------------------
            // SiteAyari (Tamamlandı)
            // ---------------------------------------------------
            modelBuilder.Entity<SiteAyari>(entity =>
            {
                entity.ToTable("site_ayarlari");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.AyarAdi).HasColumnName("ayar_adi");
                entity.Property(e => e.AyarDegeri).HasColumnName("ayar_degeri");
                entity.Property(e => e.Aciklama).HasColumnName("aciklama");
                
                entity.HasIndex(s => s.AyarAdi).IsUnique();
            });


            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Kategoriler
            modelBuilder.Entity<Kategori>().HasData(
                new Kategori { Id = 1, KategoriAdi = "PVC Pencere", Slug = "pvc-pencere", Aciklama = "PVC pencere sistemleri" },
                new Kategori { Id = 2, KategoriAdi = "PVC Kapı", Slug = "pvc-kapi", Aciklama = "PVC kapı sistemleri" },
                new Kategori { Id = 3, KategoriAdi = "Cam Balkon", Slug = "cam-balkon", Aciklama = "Cam balkon sistemleri" },
                new Kategori { Id = 4, KategoriAdi = "Pergola", Slug = "pergola", Aciklama = "Pergola sistemleri" },
                new Kategori { Id = 5, KategoriAdi = "Tek Cam", Slug = "tek-cam", UstKategoriId = 1, Aciklama = "Tek camlı PVC pencereler" },
                new Kategori { Id = 6, KategoriAdi = "Çift Cam", Slug = "cift-cam", UstKategoriId = 1, Aciklama = "Çift camlı PVC pencereler" }
            );

            // Renkler
            modelBuilder.Entity<Renk>().HasData(
                new Renk { Id = 1, RenkAdi = "Beyaz" },
                new Renk { Id = 2, RenkAdi = "Krem" },
                new Renk { Id = 3, RenkAdi = "Antrasit Gri" },
                new Renk { Id = 4, RenkAdi = "Füme" },
                new Renk { Id = 5, RenkAdi = "Kahverengi" },
                new Renk { Id = 6, RenkAdi = "Meşe Desenli" },
                new Renk { Id = 7, RenkAdi = "Ceviz Desenli" },
                new Renk { Id = 8, RenkAdi = "Altın Meşe" },
                new Renk { Id = 9, RenkAdi = "Winchester" },
                new Renk { Id = 10, RenkAdi = "Maun" }
            );

            // Site ayarları
            modelBuilder.Entity<SiteAyari>().HasData(
                new SiteAyari { Id = 1, AyarAdi = "site_baslik", AyarDegeri = "UykusuzPen - PVC Sistemleri", Aciklama = "Site ana başlığı" },
                new SiteAyari { Id = 2, AyarAdi = "telefon", AyarDegeri = "+90 (212) XXX XX XX", Aciklama = "İletişim telefonu" },
                new SiteAyari { Id = 3, AyarAdi = "email", AyarDegeri = "info@uykusuzpen.com", Aciklama = "İletişim e-postası" },
                new SiteAyari { Id = 4, AyarAdi = "adres", AyarDegeri = "İstanbul, Türkiye", Aciklama = "Firma adresi" },
                new SiteAyari { Id = 5, AyarAdi = "whatsapp", AyarDegeri = "+90 5XX XXX XX XX", Aciklama = "WhatsApp numarası" }
            );

            // SEO ayarları
            modelBuilder.Entity<SeoAyari>().HasData(
                new SeoAyari
                {
                    Id = 1,
                    SayfaTipi = "anasayfa",
                    Title = "UykusuzPen - PVC Pencere ve Kapı Sistemleri | Kaliteli ve Uygun Fiyat",
                    MetaDescription = "İstanbul'un en kaliteli PVC pencere, kapı ve cam balkon sistemleri. Uygun fiyat, hızlı montaj.",
                    MetaKeywords = "uykusuzpen, pvc pencere, pvc kapı, cam balkon, pergola, İstanbul"
                }
            );

            // Admin kullanıcı (şifre: admin123)
            modelBuilder.Entity<Kullanici>().HasData(
                new Kullanici
                {
                    Id = 1,
                    KullaniciAdi = "admin",
                    Sifre = "$2a$11$XmGE3nQrLsYhK4Z9qY5lIe9HqE.RJxDNZMxRvXLJB7K/7r5nZ8xNi",
                    AdSoyad = "Yönetici",
                    Email = "admin@uykusuzpen.com"
                }
            );
        }
    }
}