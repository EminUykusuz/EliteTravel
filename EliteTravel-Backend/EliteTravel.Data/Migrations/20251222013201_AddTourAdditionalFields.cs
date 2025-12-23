using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EliteTravel.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTourAdditionalFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DatesText",
                table: "Tours",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DepartureCity",
                table: "Tours",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HighlightsJson",
                table: "Tours",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DatesText",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "DepartureCity",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "HighlightsJson",
                table: "Tours");
        }
    }
}
