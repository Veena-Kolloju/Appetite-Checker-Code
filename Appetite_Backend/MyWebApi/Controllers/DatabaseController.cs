using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApi.Data;
using MyWebApi.Models;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;

namespace MyWebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DatabaseController : ControllerBase
{
    private readonly AppDbContext _context;

    public DatabaseController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Check database status and record counts
    /// </summary>
    [HttpGet("status")]
    public async Task<ActionResult> GetDatabaseStatus()
    {
        try
        {
            var status = new
            {
                DatabaseConnected = true,
                Tables = new
                {
                    Users = await _context.Users.CountAsync(),
                    Rules = await _context.Rules.CountAsync(),
                    Products = await _context.Products.CountAsync(),
                    ProductTypes = await _context.ProductTypes.CountAsync(),
                    Carriers = await _context.Carriers.CountAsync(),
                    Events = await _context.Events.CountAsync(),
                    Submissions = await _context.Submissions.CountAsync()
                },
                LastChecked = DateTime.UtcNow
            };

            return Ok(status);
        }
        catch (Exception ex)
        {
            return Ok(new
            {
                DatabaseConnected = false,
                Error = ex.Message,
                LastChecked = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Add sample data to database
    /// </summary>
    [HttpPost("seed")]
    public async Task<ActionResult> SeedDatabase()
    {
        try
        {
            // Add sample rules if none exist
            if (!await _context.Rules.AnyAsync())
            {
                var sampleRules = new[]
                {
                    new Models.DbRule
                    {
                        RuleId = "rule-001",
                        Title = "Health Insurance Basic Rule",
                        Product = "Health Insurance",
                        NaicsCodes = "524114",
                        States = "CA;NY;TX",
                        Status = "Active",
                        Outcome = "Eligible",
                        Priority = "High",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "System"
                    },
                    new Models.DbRule
                    {
                        RuleId = "rule-002", 
                        Title = "Motor Insurance Standard Rule",
                        Product = "Motor Insurance",
                        NaicsCodes = "524126",
                        States = "FL;TX;CA",
                        Status = "Active",
                        Outcome = "Eligible",
                        Priority = "Medium",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "System"
                    },
                    new Models.DbRule
                    {
                        RuleId = "rule-003",
                        Title = "Commercial Insurance Rule",
                        Product = "Commercial Insurance", 
                        NaicsCodes = "524130",
                        States = "NY;NJ;CT",
                        Status = "Active",
                        Outcome = "Restricted",
                        Priority = "Low",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "System"
                    }
                };

                _context.Rules.AddRange(sampleRules);
            }

            // Add sample products if none exist
            if (!await _context.Products.AnyAsync())
            {
                var sampleProducts = new[]
                {
                    new Models.DbProduct
                    {
                        Id = "prod-001",
                        Name = "Health Insurance Premium",
                        Carrier = "ABC Health Corp",
                        PerOccurrence = 1000000,
                        Aggregate = 2000000,
                        MinAnnualRevenue = 0,
                        MaxAnnualRevenue = 5000000,
                        NaicsAllowed = "524114;621111",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Models.DbProduct
                    {
                        Id = "prod-002",
                        Name = "Motor Insurance Standard",
                        Carrier = "XYZ Auto Insurance",
                        PerOccurrence = 500000,
                        Aggregate = 1000000,
                        MinAnnualRevenue = 0,
                        MaxAnnualRevenue = 2000000,
                        NaicsAllowed = "524126;441110",
                        CreatedAt = DateTime.UtcNow
                    }
                };

                _context.Products.AddRange(sampleProducts);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Database seeded successfully",
                SeedTime = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                Error = ex.Message,
                Message = "Failed to seed database"
            });
        }
    }

    /// <summary>
    /// Get all users (Admin only)
    /// </summary>
    [HttpGet("users")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> GetUsers()
    {
        try
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    EmailId = u.Email,
                    Role = u.Roles,
                    OrganizationName = u.OrganizationName,
                    OrgnId = u.OrganizationId,
                    u.CreatedAt,
                    u.IsActive
                })
                .ToListAsync();

            return Ok(users);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    /// <summary>
    /// Create new user (Admin only)
    /// </summary>
    [HttpPost("users")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> CreateUser([FromBody] DatabaseCreateUserRequest request)
    {
        try
        {
            var user = new DbUser
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name,
                Email = request.EmailId,
                Roles = request.Role,
                OrganizationName = request.OrganizationName,
                OrganizationId = request.OrgnId,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                PasswordHash = "temp_password_hash" // Should be properly hashed
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User created successfully", UserId = user.Id });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    /// <summary>
    /// Update user (Admin only)
    /// </summary>
    [HttpPut("users/{userId}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> UpdateUser(string userId, [FromBody] DatabaseUpdateUserRequest request)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { Error = "User not found" });
            }

            user.Name = request.Name;
            user.Email = request.EmailId;
            user.Roles = request.Role;
            user.OrganizationName = request.OrganizationName;
            user.OrganizationId = request.OrgnId;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "User updated successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    /// <summary>
    /// Delete user (Admin only)
    /// </summary>
    [HttpDelete("users/{userId}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> DeleteUser(string userId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { Error = "User not found" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    /// <summary>
    /// Get all product types for dropdown
    /// </summary>
    [HttpGet("product-types")]
    public async Task<ActionResult> GetProductTypes()
    {
        try
        {
            var productTypes = await _context.ProductTypes
                .Where(pt => pt.IsActive)
                .OrderBy(pt => pt.DisplayOrder)
                .Select(pt => new
                {
                    pt.ProductTypeId,
                    pt.TypeName,
                    pt.Description
                })
                .ToListAsync();

            return Ok(productTypes);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    /// <summary>
    /// Get all products with product type information
    /// </summary>
    [HttpGet("products")]
    public async Task<ActionResult> GetProducts()
    {
        try
        {
            var products = await _context.Products
                .Include(p => p.ProductType)
                .Include(p => p.CarrierEntity)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Carrier,
                    ProductType = p.ProductType != null ? p.ProductType.TypeName : null,
                    ProductTypeId = p.ProductTypeId,
                    CarrierName = p.CarrierEntity != null ? p.CarrierEntity.DisplayName : p.Carrier,
                    p.PerOccurrence,
                    p.Aggregate,
                    p.MinAnnualRevenue,
                    p.MaxAnnualRevenue,
                    p.NaicsAllowed,
                    p.CreatedAt
                })
                .ToListAsync();

            return Ok(products);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    /// <summary>
    /// Create new product
    /// </summary>
    [HttpPost("products")]
    public async Task<ActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        try
        {
            var product = new DbProduct
            {
                Id = string.IsNullOrEmpty(request.Id) ? Guid.NewGuid().ToString() : request.Id,
                Name = request.Name,
                Description = request.Description,
                Carrier = request.Carrier,
                ProductTypeId = request.ProductTypeId,
                PerOccurrence = request.PerOccurrence,
                Aggregate = request.Aggregate,
                MinAnnualRevenue = request.MinAnnualRevenue,
                MaxAnnualRevenue = request.MaxAnnualRevenue,
                NaicsAllowed = request.NaicsAllowed,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Product created successfully", ProductId = product.Id });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    /// <summary>
    /// Update existing product
    /// </summary>
    [HttpPut("products/{productId}")]
    public async Task<ActionResult> UpdateProduct(string productId, [FromBody] UpdateProductRequest request)
    {
        try
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound(new { Error = "Product not found" });
            }

            product.Name = request.Name;
            product.Description = request.Description;
            product.Carrier = request.Carrier;
            product.ProductTypeId = request.ProductTypeId;
            product.PerOccurrence = request.PerOccurrence;
            product.Aggregate = request.Aggregate;
            product.MinAnnualRevenue = request.MinAnnualRevenue;
            product.MaxAnnualRevenue = request.MaxAnnualRevenue;
            product.NaicsAllowed = request.NaicsAllowed;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Product updated successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    /// <summary>
    /// Run ProductType migration for existing deployments
    /// </summary>
    [HttpPost("migrate-product-types")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> MigrateProductTypes()
    {
        try
        {
            // Ensure ProductTypes are seeded
            if (!await _context.ProductTypes.AnyAsync())
            {
                var productTypes = new[]
                {
                    new DbProductType { TypeName = "Auto Insurance", Description = "Automobile insurance products", IsActive = true, DisplayOrder = 1, CreatedAt = DateTime.UtcNow },
                    new DbProductType { TypeName = "Health Insurance", Description = "Health insurance products", IsActive = true, DisplayOrder = 2, CreatedAt = DateTime.UtcNow },
                    new DbProductType { TypeName = "Life Insurance", Description = "Life insurance products", IsActive = true, DisplayOrder = 3, CreatedAt = DateTime.UtcNow },
                    new DbProductType { TypeName = "Property Insurance", Description = "Property insurance products", IsActive = true, DisplayOrder = 4, CreatedAt = DateTime.UtcNow },
                    new DbProductType { TypeName = "Travel Insurance", Description = "Travel insurance products", IsActive = true, DisplayOrder = 5, CreatedAt = DateTime.UtcNow },
                    new DbProductType { TypeName = "Home Insurance", Description = "Home insurance products", IsActive = true, DisplayOrder = 6, CreatedAt = DateTime.UtcNow }
                };
                
                _context.ProductTypes.AddRange(productTypes);
                await _context.SaveChangesAsync();
            }
            
            return Ok(new { Message = "ProductType migration completed successfully", Timestamp = DateTime.UtcNow });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message, Message = "ProductType migration failed" });
        }
    }
}

public class CreateProductRequest
{
    public string? Id { get; set; }
    
    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Carrier { get; set; } = string.Empty;
    
    public int? ProductTypeId { get; set; }
    
    public int PerOccurrence { get; set; } = 1000000;
    public int Aggregate { get; set; } = 2000000;
    public int MinAnnualRevenue { get; set; } = 0;
    public int MaxAnnualRevenue { get; set; } = 5000000;
    
    [Required]
    public string NaicsAllowed { get; set; } = string.Empty;
}

public class UpdateProductRequest
{
    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Carrier { get; set; } = string.Empty;
    
    public int? ProductTypeId { get; set; }
    
    public int PerOccurrence { get; set; }
    public int Aggregate { get; set; }
    public int MinAnnualRevenue { get; set; }
    public int MaxAnnualRevenue { get; set; }
    
    [Required]
    public string NaicsAllowed { get; set; } = string.Empty;
}

public class DatabaseCreateUserRequest
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string EmailId { get; set; } = string.Empty;
    
    [Required]
    [RegularExpression("^(admin|carrier|user)$", ErrorMessage = "Role must be admin, carrier, or user")]
    public string Role { get; set; } = string.Empty;
    
    [StringLength(200)]
    public string? OrganizationName { get; set; }
    
    [StringLength(50)]
    public string? OrgnId { get; set; }
}

public class DatabaseUpdateUserRequest
{
    public string Name { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? OrganizationName { get; set; }
    public string? OrgnId { get; set; }
}