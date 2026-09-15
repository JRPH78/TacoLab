using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TacoLab.Server.Migrations
{
    /// <inheritdoc />
    public partial class AdminPassHashReset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "99999999",
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAELovu4IKaw9K6rsFrYy6xbtMh6skWWknWbSgWjF8wRZI/kanL1GbjKVQM5KnOgFXYQ==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "99999999",
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEDFEdwaqr/Hjc11AyYqOQ8xEINwALEoBj4n4ou45GlQwlQFWeTl7tM9hESYN9vUIeQ==");
        }
    }
}
