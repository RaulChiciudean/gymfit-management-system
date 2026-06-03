using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymFitApi.Migrations
{
    /// <inheritdoc />
    public partial class AddDailyEnrolledCounters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EnrolledStudents",
                table: "SportClasses",
                newName: "EnrolledWednesday");

            migrationBuilder.AddColumn<int>(
                name: "EnrolledFriday",
                table: "SportClasses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EnrolledMonday",
                table: "SportClasses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EnrolledSaturday",
                table: "SportClasses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EnrolledThursday",
                table: "SportClasses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EnrolledTuesday",
                table: "SportClasses",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnrolledFriday",
                table: "SportClasses");

            migrationBuilder.DropColumn(
                name: "EnrolledMonday",
                table: "SportClasses");

            migrationBuilder.DropColumn(
                name: "EnrolledSaturday",
                table: "SportClasses");

            migrationBuilder.DropColumn(
                name: "EnrolledThursday",
                table: "SportClasses");

            migrationBuilder.DropColumn(
                name: "EnrolledTuesday",
                table: "SportClasses");

            migrationBuilder.RenameColumn(
                name: "EnrolledWednesday",
                table: "SportClasses",
                newName: "EnrolledStudents");
        }
    }
}
