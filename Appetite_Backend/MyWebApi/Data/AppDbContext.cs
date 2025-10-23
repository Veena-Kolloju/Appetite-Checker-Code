using Microsoft.EntityFrameworkCore;
using MyWebApi.Models;

namespace MyWebApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<DbUser> Users { get; set; }
    public DbSet<DbRole> Roles { get; set; }
    public DbSet<DbProduct> Products { get; set; }
    public DbSet<DbProductType> ProductTypes { get; set; }
    public DbSet<DbRule> Rules { get; set; }
    public DbSet<DbCarrier> Carriers { get; set; }
    public DbSet<DbEvent> Events { get; set; }
    public DbSet<DbSubmission> Submissions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DbRole>(entity =>
        {
            entity.HasKey(e => e.RoleId);
            entity.Property(e => e.RoleId).ValueGeneratedOnAdd();
            entity.Property(e => e.RoleName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
            
            // Indexes
            entity.HasIndex(e => e.RoleName).IsUnique().HasDatabaseName("IDX_Roles_RoleName");
        });

        modelBuilder.Entity<DbUser>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(450).IsRequired();
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(255).IsRequired();
            entity.Property(e => e.PasswordHash).HasMaxLength(255).IsRequired();
            entity.Property(e => e.Roles).HasMaxLength(200);
            entity.Property(e => e.RoleId);
            entity.Property(e => e.CarrierID);
            entity.Property(e => e.OrganizationId);
            entity.Property(e => e.OrganizationName).HasMaxLength(200);
            entity.Property(e => e.AuthProvider).HasMaxLength(50);
            entity.Property(e => e.PasswordResetToken).HasMaxLength(255);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.FailedLoginAttempts).HasDefaultValue(0);
            
            // Foreign key relationships
            entity.HasOne(e => e.Role)
                  .WithMany(r => r.Users)
                  .HasForeignKey(e => e.RoleId)
                  .OnDelete(DeleteBehavior.SetNull);
                  
            entity.HasOne(e => e.Carrier)
                  .WithMany(c => c.Users)
                  .HasForeignKey(e => e.CarrierID)
                  .OnDelete(DeleteBehavior.SetNull);
            
            // Indexes
            entity.HasIndex(e => e.Email).IsUnique().HasDatabaseName("IDX_Users_Email");
            entity.HasIndex(e => e.PasswordResetToken).HasDatabaseName("IDX_Users_ResetToken");
            entity.HasIndex(e => e.RoleId).HasDatabaseName("IDX_Users_RoleId");
            entity.HasIndex(e => e.CarrierID).HasDatabaseName("IDX_Users_CarrierID");
        });

        modelBuilder.Entity<DbCarrier>(entity =>
        {
            entity.HasKey(e => e.CarrierId);
            entity.Property(e => e.CarrierId).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1001, 1");
            entity.Property(e => e.LegalName).HasMaxLength(300).IsRequired();
            entity.Property(e => e.DisplayName).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Country).HasMaxLength(2);
            entity.Property(e => e.PrimaryContactName).HasMaxLength(200);
            entity.Property(e => e.PrimaryContactEmail).HasMaxLength(255);
            entity.Property(e => e.PrimaryContactPhone).HasMaxLength(50);
            entity.Property(e => e.TechnicalContactName).HasMaxLength(200);
            entity.Property(e => e.TechnicalContactEmail).HasMaxLength(255);
            entity.Property(e => e.AuthMethod).HasMaxLength(50);
            entity.Property(e => e.SsoMetadataUrl).HasMaxLength(1000);
            entity.Property(e => e.ApiClientId).HasMaxLength(200);
            entity.Property(e => e.ApiSecretKeyRef).HasMaxLength(200);
            entity.Property(e => e.DataResidency).HasMaxLength(100);
            entity.Property(e => e.RuleUploadMethod).HasMaxLength(50);
            entity.Property(e => e.PreferredNaicsSource).HasMaxLength(50);
            entity.Property(e => e.PasWebhookUrl).HasMaxLength(1000);
            entity.Property(e => e.WebhookAuthType).HasMaxLength(50);
            entity.Property(e => e.WebhookSecretRef).HasMaxLength(200);
            entity.Property(e => e.ContractRef).HasMaxLength(200);
            entity.Property(e => e.BillingContactEmail).HasMaxLength(255);
            entity.Property(e => e.CreatedBy).HasMaxLength(200);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
            entity.Property(e => e.RuleUploadAllowed).HasDefaultValue(false);
            entity.Property(e => e.RuleApprovalRequired).HasDefaultValue(true);
            entity.Property(e => e.DefaultRuleVersioning).HasDefaultValue(true);
            entity.Property(e => e.UseNaicsEnrichment).HasDefaultValue(false);
            
            // Indexes
            entity.HasIndex(e => e.DisplayName).HasDatabaseName("IDX_Carriers_DisplayName");
            entity.HasIndex(e => e.PrimaryContactEmail).HasDatabaseName("IDX_Carriers_PrimaryContactEmail");
        });

        modelBuilder.Entity<DbProductType>(entity =>
        {
            entity.HasKey(e => e.ProductTypeId);
            entity.Property(e => e.ProductTypeId).ValueGeneratedOnAdd();
            entity.Property(e => e.TypeName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.DisplayOrder).HasDefaultValue(0);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
            
            // Indexes
            entity.HasIndex(e => e.TypeName).IsUnique().HasDatabaseName("IDX_ProductTypes_TypeName");
            entity.HasIndex(e => e.IsActive).HasDatabaseName("IDX_ProductTypes_IsActive");
        });

        modelBuilder.Entity<DbProduct>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(450).IsRequired();
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Carrier).HasMaxLength(200);
            entity.Property(e => e.CarrierID);
            entity.Property(e => e.ProductTypeId);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
            
            // Foreign key relationships
            entity.HasOne(e => e.CarrierEntity)
                  .WithMany(c => c.Products)
                  .HasForeignKey(e => e.CarrierID)
                  .OnDelete(DeleteBehavior.SetNull);
                  
            entity.HasOne(e => e.ProductType)
                  .WithMany(pt => pt.Products)
                  .HasForeignKey(e => e.ProductTypeId)
                  .OnDelete(DeleteBehavior.SetNull);
            
            // Indexes
            entity.HasIndex(e => e.CarrierID).HasDatabaseName("IDX_Products_CarrierID");
            entity.HasIndex(e => e.ProductTypeId).HasDatabaseName("IDX_Products_ProductTypeId");
        });

        modelBuilder.Entity<DbRule>(entity =>
        {
            entity.HasKey(e => e.RuleId);
            entity.Property(e => e.RuleId).HasMaxLength(450).IsRequired();
            entity.Property(e => e.Title).HasMaxLength(200).IsRequired();
            entity.Property(e => e.BusinessType).HasMaxLength(100);
            entity.Property(e => e.Carrier).HasMaxLength(200);
            entity.Property(e => e.Product).HasMaxLength(200);
            entity.Property(e => e.CarrierID);
            entity.Property(e => e.ProductID).HasMaxLength(450);
            entity.Property(e => e.Priority).HasMaxLength(50);
            entity.Property(e => e.Outcome).HasMaxLength(50);
            entity.Property(e => e.RuleVersion).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.ContactEmail).HasMaxLength(255);
            entity.Property(e => e.CreatedBy).HasMaxLength(100);
            entity.Property(e => e.MinRevenue).HasPrecision(18, 2);
            entity.Property(e => e.MaxRevenue).HasPrecision(18, 2);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
            
            // Foreign key relationships
            entity.HasOne(e => e.CarrierEntity)
                  .WithMany(c => c.Rules)
                  .HasForeignKey(e => e.CarrierID)
                  .OnDelete(DeleteBehavior.SetNull);
                  
            entity.HasOne(e => e.ProductEntity)
                  .WithMany(p => p.Rules)
                  .HasForeignKey(e => e.ProductID)
                  .OnDelete(DeleteBehavior.SetNull);
            
            // Indexes
            entity.HasIndex(e => new { e.Carrier, e.Product }).HasDatabaseName("IDX_Rules_Carrier_Product");
            entity.HasIndex(e => e.NaicsCodes).HasDatabaseName("IDX_Rules_Naics");
            entity.HasIndex(e => new { e.Status, e.EffectiveFrom, e.EffectiveTo }).HasDatabaseName("IDX_Rules_Status_Eff");
            entity.HasIndex(e => e.CarrierID).HasDatabaseName("IDX_Rules_CarrierID");
            entity.HasIndex(e => e.ProductID).HasDatabaseName("IDX_Rules_ProductID");
        });
    }
}