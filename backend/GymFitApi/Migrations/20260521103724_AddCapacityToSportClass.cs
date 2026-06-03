using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymFitApi.Migrations
{
    /// <inheritdoc />
    public partial class AddCapacityToSportClass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EnrolledStudents",
                table: "SportClasses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxCapacity",
                table: "SportClasses",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnrolledStudents",
                table: "SportClasses");

            migrationBuilder.DropColumn(
                name: "MaxCapacity",
                table: "SportClasses");
        }
    }
}
