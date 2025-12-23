using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EliteTravel.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTranslationJsonFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExtrasJson",
                table: "TourTranslations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ItinerariesJson",
                table: "TourTranslations",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExtrasJson",
                table: "TourTranslations");

            migrationBuilder.DropColumn(
                name: "ItinerariesJson",
                table: "TourTranslations");
        }
    }
}
