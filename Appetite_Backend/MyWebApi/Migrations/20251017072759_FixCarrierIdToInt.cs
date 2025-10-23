using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApi.Migrations
{
    /// <inheritdoc />
    public partial class FixCarrierIdToInt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop foreign key constraints first
            migrationBuilder.DropForeignKey(name: "FK_Products_Carriers_CarrierID", table: "Products");
            migrationBuilder.DropForeignKey(name: "FK_Rules_Carriers_CarrierID", table: "Rules");
            migrationBuilder.DropForeignKey(name: "FK_Users_Carriers_CarrierID", table: "Users");

            // Drop indexes
            migrationBuilder.DropIndex(name: "IDX_Users_CarrierID", table: "Users");
            migrationBuilder.DropIndex(name: "IDX_Rules_CarrierID", table: "Rules");
            migrationBuilder.DropIndex(name: "IDX_Products_CarrierID", table: "Products");

            // Drop CarrierID columns
            migrationBuilder.DropColumn(name: "CarrierID", table: "Users");
            migrationBuilder.DropColumn(name: "CarrierID", table: "Rules");
            migrationBuilder.DropColumn(name: "CarrierID", table: "Products");

            // Recreate Carriers table with int IDENTITY
            migrationBuilder.DropTable(name: "Carriers");
            
            migrationBuilder.CreateTable(
                name: "Carriers",
                columns: table => new
                {
                    CarrierId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1001, 1"),
                    LegalName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Country = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: true),
                    HeadquartersAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrimaryContactName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    PrimaryContactEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PrimaryContactPhone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TechnicalContactName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TechnicalContactEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    AuthMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SsoMetadataUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ApiClientId = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ApiSecretKeyRef = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DataResidency = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ProductsOffered = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RuleUploadAllowed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    RuleUploadMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    RuleApprovalRequired = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DefaultRuleVersioning = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    UseNaicsEnrichment = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    PreferredNaicsSource = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PasWebhookUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    WebhookAuthType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    WebhookSecretRef = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ContractRef = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    BillingContactEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    RetentionPolicyDays = table.Column<int>(type: "int", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AdditionalJson = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carriers", x => x.CarrierId);
                });

            // Add new int CarrierID columns
            migrationBuilder.AddColumn<int>(name: "CarrierID", table: "Users", type: "int", nullable: true);
            migrationBuilder.AddColumn<int>(name: "CarrierID", table: "Rules", type: "int", nullable: true);
            migrationBuilder.AddColumn<int>(name: "CarrierID", table: "Products", type: "int", nullable: true);

            // Update OrganizationId to remove length constraint
            migrationBuilder.AlterColumn<string>(
                name: "OrganizationId",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldMaxLength: 450,
                oldNullable: true);

            // Recreate indexes
            migrationBuilder.CreateIndex(name: "IDX_Carriers_DisplayName", table: "Carriers", column: "DisplayName");
            migrationBuilder.CreateIndex(name: "IDX_Carriers_PrimaryContactEmail", table: "Carriers", column: "PrimaryContactEmail");
            migrationBuilder.CreateIndex(name: "IDX_Users_CarrierID", table: "Users", column: "CarrierID");
            migrationBuilder.CreateIndex(name: "IDX_Rules_CarrierID", table: "Rules", column: "CarrierID");
            migrationBuilder.CreateIndex(name: "IDX_Products_CarrierID", table: "Products", column: "CarrierID");

            // Recreate foreign key constraints
            migrationBuilder.AddForeignKey(name: "FK_Products_Carriers_CarrierID", table: "Products", column: "CarrierID", principalTable: "Carriers", principalColumn: "CarrierId", onDelete: ReferentialAction.SetNull);
            migrationBuilder.AddForeignKey(name: "FK_Rules_Carriers_CarrierID", table: "Rules", column: "CarrierID", principalTable: "Carriers", principalColumn: "CarrierId", onDelete: ReferentialAction.SetNull);
            migrationBuilder.AddForeignKey(name: "FK_Users_Carriers_CarrierID", table: "Users", column: "CarrierID", principalTable: "Carriers", principalColumn: "CarrierId", onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "OrganizationId",
                table: "Users",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CarrierID",
                table: "Users",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CarrierID",
                table: "Rules",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CarrierID",
                table: "Products",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CarrierId",
                table: "Carriers",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("SqlServer:Identity", "1, 1");
        }
    }
}
