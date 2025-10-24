using MyWebApi.Data;
using MyWebApi.Models;
using Microsoft.EntityFrameworkCore;

namespace MyWebApi.Services;

public class SeedService
{
    private readonly AppDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly IConfiguration _configuration;

    public SeedService(AppDbContext context, IPasswordService passwordService, IConfiguration configuration)
    {
        _context = context;
        _passwordService = passwordService;
        _configuration = configuration;
    }

    public async Task SeedInitialDataAsync()
    {
        // Ensure roles exist first
        if (!await _context.Roles.AnyAsync())
        {
            var roles = new[]
            {
                new DbRole { RoleName = "Admin", Description = "System administrator with full access", CreatedAt = DateTime.UtcNow },
                new DbRole { RoleName = "Carrier", Description = "Insurance carrier user", CreatedAt = DateTime.UtcNow },
                new DbRole { RoleName = "User", Description = "Standard user with limited access", CreatedAt = DateTime.UtcNow }
            };
            _context.Roles.AddRange(roles);
            await _context.SaveChangesAsync();
        }

        // Get role IDs
        var adminRole = await _context.Roles.FirstAsync(r => r.RoleName == "Admin");
        var carrierRole = await _context.Roles.FirstAsync(r => r.RoleName == "Carrier");
        var userRole = await _context.Roles.FirstAsync(r => r.RoleName == "User");

        // Only seed users if none exist (don't clear existing users)
        if (!await _context.Users.AnyAsync())
        {
            var defaultPassword = _configuration["SeedData:DefaultPassword"] ?? "TempPassword123!";
            var users = new[]
            {
                new DbUser
                {
                    Id = "usr-001",
                    Name = "System Admin",
                    Email = "admin@appetitechecker.com",
                    PasswordHash = _passwordService.HashPassword(defaultPassword),
                    Roles = "admin",
                    RoleId = adminRole.RoleId,

                    OrganizationName = "System Organization",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true,
                    AuthProvider = "local",
                    FailedLoginAttempts = 0
                }
            };

            _context.Users.AddRange(users);
        }
        
        // Seed initial products only if they don't exist
        if (!await _context.Products.AnyAsync())
        {
            var products = new[]
            {
                new DbProduct
                {
                    Id = "prod-001",
                    Name = "General Liability - SME",
                    Carrier = "Acme Insurance",
                    PerOccurrence = 1000000,
                    Aggregate = 2000000,
                    MinAnnualRevenue = 0,
                    MaxAnnualRevenue = 5000000,
                    NaicsAllowed = "445310,722511",
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                },
                new DbProduct
                {
                    Id = "prod-002",
                    Name = "Property - Retail",
                    Carrier = "Acme Insurance",
                    PerOccurrence = 500000,
                    Aggregate = 1000000,
                    MinAnnualRevenue = 0,
                    MaxAnnualRevenue = 2000000,
                    NaicsAllowed = "445110,445120",
                    CreatedAt = DateTime.UtcNow.AddDays(-20)
                },
                new DbProduct
                {
                    Id = "prod-003",
                    Name = "Workers Comp - SME",
                    Carrier = "Beta Mutual",
                    PerOccurrence = 1000000,
                    Aggregate = 1000000,
                    MinAnnualRevenue = 0,
                    MaxAnnualRevenue = 3000000,
                    NaicsAllowed = "722511,561720",
                    CreatedAt = DateTime.UtcNow.AddDays(-15)
                }
            };
            
            _context.Products.AddRange(products);
        }
        await _context.SaveChangesAsync();
    }
}