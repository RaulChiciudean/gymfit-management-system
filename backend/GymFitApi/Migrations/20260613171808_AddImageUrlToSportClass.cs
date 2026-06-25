using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymFitApi.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlToSportClass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "SportClasses",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "SportClasses");
        }
    }
}
