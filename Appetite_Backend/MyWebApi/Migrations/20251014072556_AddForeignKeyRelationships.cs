using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddForeignKeyRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CarrierID",
                table: "Users",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CarrierID",
                table: "Rules",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProductID",
                table: "Rules",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Products",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Products",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "Carrier",
                table: "Products",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "CarrierID",
                table: "Products",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IDX_Users_CarrierID",
                table: "Users",
                column: "CarrierID");

            migrationBuilder.CreateIndex(
                name: "IDX_Rules_CarrierID",
                table: "Rules",
                column: "CarrierID");

            migrationBuilder.CreateIndex(
                name: "IDX_Rules_ProductID",
                table: "Rules",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IDX_Products_CarrierID",
                table: "Products",
                column: "CarrierID");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Carriers_CarrierID",
                table: "Products",
                column: "CarrierID",
                principalTable: "Carriers",
                principalColumn: "CarrierId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Rules_Carriers_CarrierID",
                table: "Rules",
                column: "CarrierID",
                principalTable: "Carriers",
                principalColumn: "CarrierId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Rules_Products_ProductID",
                table: "Rules",
                column: "ProductID",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Carriers_CarrierID",
                table: "Users",
                column: "CarrierID",
                principalTable: "Carriers",
                principalColumn: "CarrierId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Carriers_CarrierID",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Rules_Carriers_CarrierID",
                table: "Rules");

            migrationBuilder.DropForeignKey(
                name: "FK_Rules_Products_ProductID",
                table: "Rules");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Carriers_CarrierID",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IDX_Users_CarrierID",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IDX_Rules_CarrierID",
                table: "Rules");

            migrationBuilder.DropIndex(
                name: "IDX_Rules_ProductID",
                table: "Rules");

            migrationBuilder.DropIndex(
                name: "IDX_Products_CarrierID",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CarrierID",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CarrierID",
                table: "Rules");

            migrationBuilder.DropColumn(
                name: "ProductID",
                table: "Rules");

            migrationBuilder.DropColumn(
                name: "CarrierID",
                table: "Products");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Products",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AlterColumn<string>(
                name: "Carrier",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);
        }
    }
}
