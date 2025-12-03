using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace UykusuzPenApi.Migrations
{
    /// <inheritdoc />
    public partial class AddKategoriIdToRenkler : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "iletisim_mesajlari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AdSoyad = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Telefon = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FirmaAdi = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsTuru = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Mesaj = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Durum = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Tarih = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_iletisim_mesajlari", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "kategoriler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    kategori_adi = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ust_kategori_id = table.Column<int>(type: "int", nullable: true),
                    slug = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    aciklama = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_kategoriler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_kategoriler_kategoriler_ust_kategori_id",
                        column: x => x.ust_kategori_id,
                        principalTable: "kategoriler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "kullanicilar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    KullaniciAdi = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Sifre = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdSoyad = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_kullanicilar", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "seo_ayarlari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SayfaTipi = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SayfaId = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MetaDescription = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MetaKeywords = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_seo_ayarlari", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "site_ayarlari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AyarAdi = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AyarDegeri = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Aciklama = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_site_ayarlari", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "galeri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Baslik = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Aciklama = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KategoriId = table.Column<int>(type: "int", nullable: true),
                    Il = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Ilce = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MedyaTipi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MedyaYolu = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KapakResmi = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AltText = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_galeri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_galeri_kategoriler_KategoriId",
                        column: x => x.KategoriId,
                        principalTable: "kategoriler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "renkler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RenkAdi = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    kategori_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_renkler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_renkler_kategoriler_kategori_id",
                        column: x => x.kategori_id,
                        principalTable: "kategoriler",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "urunler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UrunAdi = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Aciklama = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KategoriId = table.Column<int>(type: "int", nullable: true),
                    AnaResim = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_urunler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_urunler_kategoriler_KategoriId",
                        column: x => x.KategoriId,
                        principalTable: "kategoriler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "urun_renkler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    urun_id = table.Column<int>(type: "int", nullable: false),
                    renk_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_urun_renkler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_urun_renkler_renkler_renk_id",
                        column: x => x.renk_id,
                        principalTable: "renkler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_urun_renkler_urunler_urun_id",
                        column: x => x.urun_id,
                        principalTable: "urunler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "urun_resimleri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UrunId = table.Column<int>(type: "int", nullable: false),
                    ResimYolu = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AltText = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_urun_resimleri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_urun_resimleri_urunler_UrunId",
                        column: x => x.UrunId,
                        principalTable: "urunler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "kategoriler",
                columns: new[] { "Id", "aciklama", "kategori_adi", "slug", "ust_kategori_id" },
                values: new object[,]
                {
                    { 1, "PVC pencere sistemleri", "PVC Pencere", "pvc-pencere", null },
                    { 2, "PVC kapı sistemleri", "PVC Kapı", "pvc-kapi", null },
                    { 3, "Cam balkon sistemleri", "Cam Balkon", "cam-balkon", null },
                    { 4, "Pergola sistemleri", "Pergola", "pergola", null }
                });

            migrationBuilder.InsertData(
                table: "kullanicilar",
                columns: new[] { "Id", "AdSoyad", "Email", "KullaniciAdi", "Sifre" },
                values: new object[] { 1, "Yönetici", "admin@uykusuzpen.com", "admin", "$2a$11$XmGE3nQrLsYhK4Z9qY5lIe9HqE.RJxDNZMxRvXLJB7K/7r5nZ8xNi" });

            migrationBuilder.InsertData(
                table: "renkler",
                columns: new[] { "Id", "kategori_id", "RenkAdi" },
                values: new object[,]
                {
                    { 1, null, "Beyaz" },
                    { 2, null, "Krem" },
                    { 3, null, "Antrasit Gri" },
                    { 4, null, "Füme" },
                    { 5, null, "Kahverengi" },
                    { 6, null, "Meşe Desenli" },
                    { 7, null, "Ceviz Desenli" },
                    { 8, null, "Altın Meşe" },
                    { 9, null, "Winchester" },
                    { 10, null, "Maun" }
                });

            migrationBuilder.InsertData(
                table: "seo_ayarlari",
                columns: new[] { "Id", "MetaDescription", "MetaKeywords", "SayfaId", "SayfaTipi", "Title" },
                values: new object[] { 1, "İstanbul'un en kaliteli PVC pencere, kapı ve cam balkon sistemleri. Uygun fiyat, hızlı montaj.", "uykusuzpen, pvc pencere, pvc kapı, cam balkon, pergola, İstanbul", null, "anasayfa", "UykusuzPen - PVC Pencere ve Kapı Sistemleri | Kaliteli ve Uygun Fiyat" });

            migrationBuilder.InsertData(
                table: "site_ayarlari",
                columns: new[] { "Id", "Aciklama", "AyarAdi", "AyarDegeri" },
                values: new object[,]
                {
                    { 1, "Site ana başlığı", "site_baslik", "UykusuzPen - PVC Sistemleri" },
                    { 2, "İletişim telefonu", "telefon", "+90 (212) XXX XX XX" },
                    { 3, "İletişim e-postası", "email", "info@uykusuzpen.com" },
                    { 4, "Firma adresi", "adres", "İstanbul, Türkiye" },
                    { 5, "WhatsApp numarası", "whatsapp", "+90 5XX XXX XX XX" }
                });

            migrationBuilder.InsertData(
                table: "kategoriler",
                columns: new[] { "Id", "aciklama", "kategori_adi", "slug", "ust_kategori_id" },
                values: new object[,]
                {
                    { 5, "Tek camlı PVC pencereler", "Tek Cam", "tek-cam", 1 },
                    { 6, "Çift camlı PVC pencereler", "Çift Cam", "cift-cam", 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_galeri_KategoriId",
                table: "galeri",
                column: "KategoriId");

            migrationBuilder.CreateIndex(
                name: "IX_kategoriler_slug",
                table: "kategoriler",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_kategoriler_ust_kategori_id",
                table: "kategoriler",
                column: "ust_kategori_id");

            migrationBuilder.CreateIndex(
                name: "IX_kullanicilar_KullaniciAdi",
                table: "kullanicilar",
                column: "KullaniciAdi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_renkler_kategori_id",
                table: "renkler",
                column: "kategori_id");

            migrationBuilder.CreateIndex(
                name: "IX_renkler_RenkAdi",
                table: "renkler",
                column: "RenkAdi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_seo_ayarlari_SayfaTipi_SayfaId",
                table: "seo_ayarlari",
                columns: new[] { "SayfaTipi", "SayfaId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_site_ayarlari_AyarAdi",
                table: "site_ayarlari",
                column: "AyarAdi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_urun_renkler_renk_id",
                table: "urun_renkler",
                column: "renk_id");

            migrationBuilder.CreateIndex(
                name: "IX_urun_renkler_urun_id_renk_id",
                table: "urun_renkler",
                columns: new[] { "urun_id", "renk_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_urun_resimleri_UrunId",
                table: "urun_resimleri",
                column: "UrunId");

            migrationBuilder.CreateIndex(
                name: "IX_urunler_KategoriId",
                table: "urunler",
                column: "KategoriId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "galeri");

            migrationBuilder.DropTable(
                name: "iletisim_mesajlari");

            migrationBuilder.DropTable(
                name: "kullanicilar");

            migrationBuilder.DropTable(
                name: "seo_ayarlari");

            migrationBuilder.DropTable(
                name: "site_ayarlari");

            migrationBuilder.DropTable(
                name: "urun_renkler");

            migrationBuilder.DropTable(
                name: "urun_resimleri");

            migrationBuilder.DropTable(
                name: "renkler");

            migrationBuilder.DropTable(
                name: "urunler");

            migrationBuilder.DropTable(
                name: "kategoriler");
        }
    }
}
