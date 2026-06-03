using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymFitApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSportClassEnrollment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EnrolledSunday",
                table: "SportClasses",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnrolledSunday",
                table: "SportClasses");
        }
    }
}
