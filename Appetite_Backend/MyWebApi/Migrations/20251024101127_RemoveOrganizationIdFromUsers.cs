using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApi.Migrations
{
    /// <inheritdoc />
    public partial class RemoveOrganizationIdFromUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrganizationId",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
