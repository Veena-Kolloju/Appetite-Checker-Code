using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddProductTypeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Products",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProductTypeId",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProductTypes",
                columns: table => new
                {
                    ProductTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductTypes", x => x.ProductTypeId);
                });

            migrationBuilder.CreateIndex(
                name: "IDX_Products_ProductTypeId",
                table: "Products",
                column: "ProductTypeId");

            migrationBuilder.CreateIndex(
                name: "IDX_ProductTypes_IsActive",
                table: "ProductTypes",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IDX_ProductTypes_TypeName",
                table: "ProductTypes",
                column: "TypeName",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductTypes_ProductTypeId",
                table: "Products",
                column: "ProductTypeId",
                principalTable: "ProductTypes",
                principalColumn: "ProductTypeId",
                onDelete: ReferentialAction.SetNull);

            // Insert seed data for ProductTypes
            migrationBuilder.InsertData(
                table: "ProductTypes",
                columns: new[] { "TypeName", "Description", "IsActive", "DisplayOrder", "CreatedAt" },
                values: new object[,]
                {
                    { "Auto Insurance", "Automobile insurance products", true, 1, DateTime.UtcNow },
                    { "Health Insurance", "Health insurance products", true, 2, DateTime.UtcNow },
                    { "Life Insurance", "Life insurance products", true, 3, DateTime.UtcNow },
                    { "Property Insurance", "Property insurance products", true, 4, DateTime.UtcNow },
                    { "Travel Insurance", "Travel insurance products", true, 5, DateTime.UtcNow },
                    { "Home Insurance", "Home insurance products", true, 6, DateTime.UtcNow }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductTypes_ProductTypeId",
                table: "Products");

            // Delete seed data is handled by dropping the table
            migrationBuilder.DropTable(
                name: "ProductTypes");

            migrationBuilder.DropIndex(
                name: "IDX_Products_ProductTypeId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProductTypeId",
                table: "Products");
        }
    }
}
