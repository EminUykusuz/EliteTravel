using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UykusuzPenApi.Migrations
{
    /// <inheritdoc />
    public partial class RenkKategoriIliskisi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_renkler_kategoriler_kategori_id",
                table: "renkler");

            migrationBuilder.RenameColumn(
                name: "kategori_id",
                table: "renkler",
                newName: "KategoriId");

            migrationBuilder.RenameIndex(
                name: "IX_renkler_kategori_id",
                table: "renkler",
                newName: "IX_renkler_KategoriId");

            migrationBuilder.AddForeignKey(
                name: "FK_renkler_kategoriler_KategoriId",
                table: "renkler",
                column: "KategoriId",
                principalTable: "kategoriler",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_renkler_kategoriler_KategoriId",
                table: "renkler");

            migrationBuilder.RenameColumn(
                name: "KategoriId",
                table: "renkler",
                newName: "kategori_id");

            migrationBuilder.RenameIndex(
                name: "IX_renkler_KategoriId",
                table: "renkler",
                newName: "IX_renkler_kategori_id");

            migrationBuilder.AddForeignKey(
                name: "FK_renkler_kategoriler_kategori_id",
                table: "renkler",
                column: "kategori_id",
                principalTable: "kategoriler",
                principalColumn: "Id");
        }
    }
}
