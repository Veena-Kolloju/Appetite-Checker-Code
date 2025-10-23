using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyWebApi.Migrations
{
    /// <inheritdoc />
    public partial class ChangeRoleIdToInt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: Create new tables with numeric IDs
            migrationBuilder.CreateTable(
                name: "Roles_New",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles_New", x => x.RoleId);
                });

            // Step 2: Copy data with ID mapping
            migrationBuilder.Sql(@"
                INSERT INTO Roles_New (RoleName, Description, CreatedAt, UpdatedAt)
                SELECT RoleName, Description, CreatedAt, UpdatedAt
                FROM Roles
                ORDER BY 
                    CASE RoleId 
                        WHEN 'role-admin' THEN 1
                        WHEN 'role-carrier' THEN 2
                        WHEN 'role-user' THEN 3
                        ELSE 4
                    END
            ");

            // Step 3: Add temp column to Users
            migrationBuilder.AddColumn<int>(
                name: "RoleId_New",
                table: "Users",
                type: "int",
                nullable: true);

            // Step 4: Update Users with new numeric IDs
            migrationBuilder.Sql(@"
                UPDATE Users SET RoleId_New = 
                    CASE RoleId
                        WHEN 'role-admin' THEN 1
                        WHEN 'role-carrier' THEN 2
                        WHEN 'role-user' THEN 3
                        ELSE NULL
                    END
            ");

            // Step 5: Drop foreign key and indexes
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IDX_Users_RoleId",
                table: "Users");

            // Step 6: Drop old tables
            migrationBuilder.DropTable(name: "Roles");

            // Step 7: Rename new table
            migrationBuilder.RenameTable(
                name: "Roles_New",
                newName: "Roles");

            migrationBuilder.RenameIndex(
                name: "PK_Roles_New",
                table: "Roles",
                newName: "PK_Roles");

            // Step 8: Drop old RoleId column and rename new one
            migrationBuilder.DropColumn(
                name: "RoleId",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "RoleId_New",
                table: "Users",
                newName: "RoleId");

            // Step 9: Recreate indexes and constraints
            migrationBuilder.CreateIndex(
                name: "IDX_Roles_RoleName",
                table: "Roles",
                column: "RoleName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IDX_Users_RoleId",
                table: "Users",
                column: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "RoleId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "RoleId",
                table: "Users",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "RoleId",
                table: "Roles",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("SqlServer:Identity", "1, 1");
        }
    }
}
