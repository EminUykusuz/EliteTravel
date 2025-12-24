using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EliteTravel.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddGalleryPhotosAndFavicon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GalleryPhotosJson",
                table: "Tours",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FaviconUrl",
                table: "Settings",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GalleryPhotosJson",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "FaviconUrl",
                table: "Settings");
        }
    }
}
