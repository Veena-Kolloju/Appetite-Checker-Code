using MyWebApi.Data;
using MyWebApi.Models;
using Microsoft.EntityFrameworkCore;

namespace MyWebApi.Services;

public class SeedService
{
    private readonly AppDbContext _context;
    private readonly IPasswordService _passwordService;

    public SeedService(AppDbContext context, IPasswordService passwordService)
    {
        _context = context;
        _passwordService = passwordService;
    }

    public async Task SeedInitialDataAsync()
    {
        // Clear existing users and reseed
        if (await _context.Users.AnyAsync())
        {
            _context.Users.RemoveRange(_context.Users);
            await _context.SaveChangesAsync();
        }

        var users = new[]
        {
            new DbUser
            {
                Id = "usr-001",
                Name = "System Admin",
                Email = "admin@appetitechecker.com",
                PasswordHash = _passwordService.HashPassword("Admin123!"),
                Roles = "admin",
                OrganizationId = "SYS001",
                OrganizationName = "System Organization",
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                AuthProvider = "local",
                FailedLoginAttempts = 0
            },
            new DbUser
            {
                Id = "usr-002",
                Name = "John Carrier",
                Email = "carrier@example.com",
                PasswordHash = _passwordService.HashPassword("Admin123!"),
                Roles = "carrier",
                OrganizationId = "ABC001",
                OrganizationName = "ABC Insurance",
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                AuthProvider = "local",
                FailedLoginAttempts = 0
            },
            new DbUser
            {
                Id = "usr-003",
                Name = "Jane Agent",
                Email = "agent@example.com",
                PasswordHash = _passwordService.HashPassword("Admin123!"),
                Roles = "user",
                OrganizationId = "XYZ001",
                OrganizationName = "XYZ Brokerage",
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                AuthProvider = "local",
                FailedLoginAttempts = 0
            },
            new DbUser
            {
                Id = "usr-004",
                Name = "Mike Manager",
                Email = "manager@demo.com",
                PasswordHash = _passwordService.HashPassword("Admin123!"),
                Roles = "admin",
                OrganizationId = "DEMO001",
                OrganizationName = "Demo Corporation",
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                AuthProvider = "local",
                FailedLoginAttempts = 0
            },
            new DbUser
            {
                Id = "usr-005",
                Name = "Sarah Smith",
                Email = "sarah@carrier2.com",
                PasswordHash = _passwordService.HashPassword("Admin123!"),
                Roles = "carrier",
                OrganizationId = "DEF001",
                OrganizationName = "DEF Insurance Group",
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                AuthProvider = "local",
                FailedLoginAttempts = 0
            }
        };

        _context.Users.AddRange(users);
        
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