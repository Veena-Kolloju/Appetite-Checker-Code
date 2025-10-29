using MyWebApi.Models;
using MyWebApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace MyWebApi.Services;

public interface ICanvasService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<RegisterResponse> RegisterAsync(RegisterRequest request);
    Task<UserProfile> GetCarrierAsync(string id);
    Task<UsersResponse> GetCarriersAsync(int page, int pageSize, string? role);
    Task<UserProfile> CreateCarrierAsync(UserProfile carrier);
    Task<ProductDetails> GetProductAsync(string id);
    Task<ProductsResponse> GetProductsAsync(string? carrier, int page, int pageSize);
    Task<ProductDetails> CreateProductAsync(ProductDetails product);
    Task<ProductDetails> UpdateProductAsync(string id, ProductDetails product);
    Task DeleteProductAsync(string id);
    Task<RuleDetails> GetRuleAsync(string id);
    Task<RulesResponse> GetRulesAsync(int page, int pageSize, string? sortBy);
    Task<RuleDetails> CreateRuleAsync(RuleDetails rule);
    Task<RuleDetails> UpdateRuleAsync(string id, RuleDetails rule);
    Task DeleteRuleAsync(string id);
    Task<RuleUploadResponse> UploadRulesAsync(IFormFile file, bool overwrite);
    Task<CarrierDetails> GetCarrierDetailsAsync(string id);
    Task<CarriersResponse> GetCarriersListAsync(int page, int pageSize);
    Task<CarrierDetails> CreateCarrierDetailsAsync(CarrierDetails carrier);
    Task<CarrierDetails> UpdateCarrierDetailsAsync(string id, CarrierDetails carrier);
    Task DeleteCarrierDetailsAsync(string id);
    Task<CanvasAnalyticsResponse> GetAnalyticsAsync(DateTime? since);
    Task<CreateUserResponse> CreateUserAsync(CreateUserRequest request);
}

public class CanvasService : ICanvasService
{
    private readonly AppDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly IJwtService _jwtService;
    private readonly IIdGenerationService _idGenerationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CanvasService(AppDbContext context, IPasswordService passwordService, IJwtService jwtService, IIdGenerationService idGenerationService, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _passwordService = passwordService;
        _jwtService = jwtService;
        _idGenerationService = idGenerationService;
        _httpContextAccessor = httpContextAccessor;
    }

    private async Task<(string userId, string[] roles, int? carrierId)> GetCurrentUserContextAsync()
    {
        var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException("User not authenticated");
        
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
            throw new UnauthorizedAccessException("User not found");
        
        var roles = user.Roles?.Split(',', StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>();
        return (userId, roles, user.CarrierID);
    }

    private static bool IsSuperAdmin(string[] roles) => roles.Contains("admin");
    private static bool IsCarrierAdmin(string[] roles) => roles.Contains("carrier");
    private static bool IsCarrierUser(string[] roles) => roles.Contains("user");

    private static void ValidateCarrierAccess(string[] roles, int? userCarrierId, int? targetCarrierId)
    {
        if (IsSuperAdmin(roles)) return; // Super Admin has full access
        
        if (userCarrierId == null)
            throw new UnauthorizedAccessException("User not associated with any carrier");
        
        if (targetCarrierId != userCarrierId)
            throw new UnauthorizedAccessException("Access denied to other carrier's data");
    }

    private string GenerateTemporaryPassword()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 12)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => (u.Email == request.Username || u.Name == request.Username) && u.IsActive);
        if (user == null)
            throw new UnauthorizedAccessException("Invalid credentials");

        if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow)
            throw new UnauthorizedAccessException("Account is locked. Try again later.");

        if (!_passwordService.VerifyPassword(request.Password, user.PasswordHash))
        {
            user.FailedLoginAttempts++;
            if (user.FailedLoginAttempts >= 5)
            {
                user.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
            }
            await _context.SaveChangesAsync();
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        user.FailedLoginAttempts = 0;
        user.LockoutEnd = null;
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);
        var roles = user.Roles?.Split(',', StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>();
        var userInfo = new UserInfo(user.Id, user.Name, roles, user.IsActive, user.LastLoginAt, user.AuthProvider, user.OrganizationName);
        return new LoginResponse(token, "Bearer", 3600, userInfo);
    }

    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Admin.Email);
        if (existingUser != null)
            throw new InvalidOperationException("User with this email already exists");

        // Check if this is the first user (Super Admin creation)
        var userCount = await _context.Users.CountAsync();
        var role = userCount == 0 ? "admin" : "carrier";
        
        var userId = await _idGenerationService.GenerateUserIdAsync();
        var hashedPassword = _passwordService.HashPassword(request.Password);
        
        DbCarrier? dbCarrier = null;
        int? carrierId = null;
        
        // Only create carrier for Carrier Admin, not Super Admin
        if (role == "carrier")
        {
            dbCarrier = new DbCarrier
            {
                LegalName = request.OrganizationName,
                DisplayName = request.OrganizationName,
                PrimaryContactName = request.Admin.Name,
                PrimaryContactEmail = request.Admin.Email,
                PrimaryContactPhone = request.Admin.Phone,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "system"
            };
            
            _context.Carriers.Add(dbCarrier);
            await _context.SaveChangesAsync();
            carrierId = dbCarrier.CarrierId;
        }
        
        var newUser = new DbUser
        {
            Id = userId,
            Name = request.Username,
            Email = request.Admin.Email,
            PasswordHash = hashedPassword,
            Roles = role,
            CarrierID = carrierId,
            OrganizationName = role == "admin" ? "System" : request.OrganizationName,
            CreatedAt = DateTime.UtcNow,
            IsActive = true,
            AuthProvider = "local"
        };
        
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();
        
        return new RegisterResponse(userId, "active", $"Registration successful as {role}. You can now login with your credentials.");
    }

    public async Task<UserProfile> GetCarrierAsync(string id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null)
            throw new KeyNotFoundException($"Carrier {id} not found");
        
        var roles = user.Roles?.Split(',', StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>();
        var profile = new UserProfile(user.Id, user.Name, user.Email, roles, 
            new OrganizationInfo(user.CarrierID?.ToString() ?? "", user.OrganizationName ?? ""), 
            user.CreatedAt, user.IsActive, user.LastLoginAt, user.AuthProvider);
        return profile;
    }

    public async Task<UsersResponse> GetCarriersAsync(int page, int pageSize, string? role)
    {
        var (currentUserId, currentRoles, currentCarrierId) = await GetCurrentUserContextAsync();
        
        var query = _context.Users.AsQueryable();
        
        // Apply role-based filtering
        if (!IsSuperAdmin(currentRoles))
        {
            // Carrier Admin/User can only see users from their carrier
            query = query.Where(u => u.CarrierID == currentCarrierId);
        }
        
        if (!string.IsNullOrEmpty(role))
            query = query.Where(u => u.Roles != null && u.Roles.Contains(role));

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
        
        var users = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserSummary(u.Id, u.Name, u.Email, 
                u.Roles != null ? u.Roles.Split(',', StringSplitOptions.RemoveEmptyEntries) : Array.Empty<string>(), 
                u.IsActive))
            .ToArrayAsync();

        var pagination = new PaginationInfo(page, pageSize, totalPages, totalItems);
        return new UsersResponse(users, pagination);
    }

    public async Task<UserProfile> CreateCarrierAsync(UserProfile carrier)
    {
        var (currentUserId, currentRoles, currentCarrierId) = await GetCurrentUserContextAsync();
        
        // Permission checks
        if (carrier.Roles.Contains("admin"))
            throw new UnauthorizedAccessException("Cannot create Super Admin users");
        
        if (carrier.Roles.Contains("carrier"))
        {
            // Super Admin can create Carrier Admin for new carrier
            // Carrier Admin can create another Carrier Admin for same carrier
            if (!IsSuperAdmin(currentRoles) && !IsCarrierAdmin(currentRoles))
                throw new UnauthorizedAccessException("Only Super Admin or Carrier Admin can create Carrier Admins");
        }
        
        if (carrier.Roles.Contains("user") && !IsSuperAdmin(currentRoles) && !IsCarrierAdmin(currentRoles))
            throw new UnauthorizedAccessException("Only Super Admin or Carrier Admin can create Carrier Users");
        
        var userId = await _idGenerationService.GenerateUserIdAsync();
        var tempPassword = GenerateTemporaryPassword();
        var hashedPassword = _passwordService.HashPassword(tempPassword);
        
        DbCarrier? dbCarrier = null;
        int? carrierIdToAssign = null;
        
        if (carrier.Roles.Contains("carrier"))
        {
            if (IsSuperAdmin(currentRoles))
            {
                // Super Admin creating new Carrier Admin with new carrier
                dbCarrier = new DbCarrier
                {
                    LegalName = carrier.Organization.Name,
                    DisplayName = carrier.Organization.Name,
                    PrimaryContactName = carrier.Name,
                    PrimaryContactEmail = carrier.Email,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = currentUserId
                };
                _context.Carriers.Add(dbCarrier);
                await _context.SaveChangesAsync();
                carrierIdToAssign = dbCarrier.CarrierId;
            }
            else if (IsCarrierAdmin(currentRoles))
            {
                // Carrier Admin creating another Carrier Admin for same carrier
                carrierIdToAssign = currentCarrierId;
            }
        }
        else if (carrier.Roles.Contains("user"))
        {
            // Creating Carrier User - use current user's carrier or specified carrier
            if (IsCarrierAdmin(currentRoles))
            {
                carrierIdToAssign = currentCarrierId;
            }
            else if (IsSuperAdmin(currentRoles) && !string.IsNullOrEmpty(carrier.Organization.Id))
            {
                if (int.TryParse(carrier.Organization.Id, out int existingCarrierId))
                {
                    carrierIdToAssign = existingCarrierId;
                }
            }
        }
        
        var organizationName = carrier.Organization.Name;
        if (IsCarrierAdmin(currentRoles) && currentCarrierId.HasValue)
        {
            // Get current user's organization name
            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId);
            organizationName = currentUser?.OrganizationName ?? carrier.Organization.Name;
        }
        
        var dbUser = new DbUser
        {
            Id = userId,
            Name = carrier.Name,
            Email = carrier.Email,
            PasswordHash = hashedPassword,
            Roles = string.Join(",", carrier.Roles),
            CarrierID = carrierIdToAssign,
            OrganizationName = organizationName,
            CreatedAt = DateTime.UtcNow,
            IsActive = carrier.IsActive,
            AuthProvider = carrier.AuthProvider ?? "local"
        };
        
        _context.Users.Add(dbUser);
        await _context.SaveChangesAsync();
        
        var createdCarrier = new UserProfile(dbUser.Id, dbUser.Name, dbUser.Email, carrier.Roles, 
            new OrganizationInfo(dbUser.CarrierID?.ToString() ?? "", dbUser.OrganizationName ?? ""), 
            dbUser.CreatedAt, dbUser.IsActive, dbUser.LastLoginAt, dbUser.AuthProvider);
        return createdCarrier;
    }

    public async Task<ProductDetails> GetProductAsync(string id)
    {
        var product = await _context.Products.Include(p => p.ProductType).FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
            throw new KeyNotFoundException($"Product {id} not found");
        
        return new ProductDetails(product.Id, product.Name, product.Description, 
            product.ProductType?.TypeName, product.Carrier, product.PerOccurrence, product.Aggregate,
            product.MinAnnualRevenue, product.MaxAnnualRevenue, product.NaicsAllowed, product.CreatedAt);
    }

    public async Task<ProductsResponse> GetProductsAsync(string? carrier, int page, int pageSize)
    {
        var (currentUserId, currentRoles, currentCarrierId) = await GetCurrentUserContextAsync();
        
        var query = _context.Products.Include(p => p.ProductType).AsQueryable();
        
        // Apply role-based filtering
        if (!IsSuperAdmin(currentRoles))
        {
            query = query.Where(p => p.CarrierID == currentCarrierId);
        }
        
        if (!string.IsNullOrEmpty(carrier))
            query = query.Where(p => p.Carrier == carrier);

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
        
        var products = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductSummary(p.Id, p.Name, p.Carrier))
            .ToArrayAsync();

        var pagination = new PaginationInfo(page, pageSize, totalPages, totalItems);
        return new ProductsResponse(products, pagination);
    }

    public async Task<ProductDetails> CreateProductAsync(ProductDetails product)
    {
        var (currentUserId, currentRoles, currentCarrierId) = await GetCurrentUserContextAsync();
        
        // Carrier Users can create products, but only for their carrier
        if (!IsSuperAdmin(currentRoles) && !IsCarrierAdmin(currentRoles) && !IsCarrierUser(currentRoles))
            throw new UnauthorizedAccessException("Insufficient permissions to create products");
        
        var productId = await _idGenerationService.GenerateProductIdAsync();
        
        // Find or create ProductType
        int? productTypeId = null;
        if (!string.IsNullOrWhiteSpace(product.ProductType))
        {
            var existingType = await _context.ProductTypes.FirstOrDefaultAsync(pt => pt.TypeName == product.ProductType);
            if (existingType == null)
            {
                var newType = new DbProductType
                {
                    TypeName = product.ProductType,
                    IsActive = true,
                    DisplayOrder = 0,
                    CreatedAt = DateTime.UtcNow
                };
                _context.ProductTypes.Add(newType);
                await _context.SaveChangesAsync();
                productTypeId = newType.ProductTypeId;
            }
            else
            {
                productTypeId = existingType.ProductTypeId;
            }
        }
        
        var dbProduct = new DbProduct
        {
            Id = productId,
            Name = product.Name,
            Description = product.Description,
            Carrier = product.Carrier,
            CarrierID = IsSuperAdmin(currentRoles) ? null : currentCarrierId,
            ProductTypeId = productTypeId,
            PerOccurrence = product.PerOccurrence,
            Aggregate = product.Aggregate,
            MinAnnualRevenue = product.MinAnnualRevenue,
            MaxAnnualRevenue = product.MaxAnnualRevenue,
            NaicsAllowed = product.NaicsAllowed,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.Products.Add(dbProduct);
        await _context.SaveChangesAsync();
        
        return new ProductDetails(dbProduct.Id, dbProduct.Name, dbProduct.Description,
            product.ProductType, dbProduct.Carrier, dbProduct.PerOccurrence, dbProduct.Aggregate,
            dbProduct.MinAnnualRevenue, dbProduct.MaxAnnualRevenue, dbProduct.NaicsAllowed, dbProduct.CreatedAt);
    }

    public async Task<ProductDetails> UpdateProductAsync(string id, ProductDetails product)
    {
        var dbProduct = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (dbProduct == null)
            throw new KeyNotFoundException($"Product {id} not found");
        
        // Find or create ProductType
        int? productTypeId = null;
        if (!string.IsNullOrEmpty(product.ProductType))
        {
            var existingType = await _context.ProductTypes.FirstOrDefaultAsync(pt => pt.TypeName == product.ProductType);
            if (existingType == null)
            {
                var newType = new DbProductType
                {
                    TypeName = product.ProductType,
                    IsActive = true,
                    DisplayOrder = 0,
                    CreatedAt = DateTime.UtcNow
                };
                _context.ProductTypes.Add(newType);
                await _context.SaveChangesAsync();
                productTypeId = newType.ProductTypeId;
            }
            else
            {
                productTypeId = existingType.ProductTypeId;
            }
        }
        
        dbProduct.Name = product.Name;
        dbProduct.Description = product.Description;
        dbProduct.Carrier = product.Carrier;
        dbProduct.ProductTypeId = productTypeId;
        dbProduct.PerOccurrence = product.PerOccurrence;
        dbProduct.Aggregate = product.Aggregate;
        dbProduct.MinAnnualRevenue = product.MinAnnualRevenue;
        dbProduct.MaxAnnualRevenue = product.MaxAnnualRevenue;
        dbProduct.NaicsAllowed = product.NaicsAllowed;
        
        await _context.SaveChangesAsync();
        
        return new ProductDetails(dbProduct.Id, dbProduct.Name, dbProduct.Description,
            product.ProductType, dbProduct.Carrier, dbProduct.PerOccurrence, dbProduct.Aggregate,
            dbProduct.MinAnnualRevenue, dbProduct.MaxAnnualRevenue, dbProduct.NaicsAllowed, dbProduct.CreatedAt);
    }

    public async Task DeleteProductAsync(string id)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
            throw new KeyNotFoundException($"Product {id} not found");
        
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
    }

    public async Task<RuleDetails> GetRuleAsync(string id)
    {
        var rule = await _context.Rules.FirstOrDefaultAsync(r => r.RuleId == id);
        if (rule == null)
            throw new KeyNotFoundException($"Rule {id} not found");
        
        return new RuleDetails(rule.RuleId, rule.Title, rule.Description, rule.BusinessType,
            rule.NaicsCodes?.Split(',', StringSplitOptions.RemoveEmptyEntries),
            rule.States?.Split(',', StringSplitOptions.RemoveEmptyEntries),
            rule.Carrier, rule.Product,
            rule.Restrictions?.Split(',', StringSplitOptions.RemoveEmptyEntries),
            rule.Priority, rule.Outcome, rule.RuleVersion, rule.Status,
            rule.EffectiveFrom, rule.EffectiveTo, rule.MinRevenue, rule.MaxRevenue,
            rule.MinYearsInBusiness, rule.MaxYearsInBusiness, rule.PriorClaimsAllowed,
            rule.Conditions?.Split(',', StringSplitOptions.RemoveEmptyEntries),
            rule.ContactEmail, rule.CreatedBy, rule.CreatedAt, rule.UpdatedAt, rule.AdditionalJson);
    }

    public async Task<RulesResponse> GetRulesAsync(int page, int pageSize, string? sortBy)
    {
        var (currentUserId, currentRoles, currentCarrierId) = await GetCurrentUserContextAsync();
        
        var query = _context.Rules.AsQueryable();
        
        // Apply role-based filtering
        if (!IsSuperAdmin(currentRoles))
        {
            query = query.Where(r => r.CarrierID == currentCarrierId);
        }
        
        query = sortBy?.ToLower() switch
        {
            "priority" => query.OrderBy(r => r.Priority),
            "status" => query.OrderBy(r => r.Status),
            "created" => query.OrderByDescending(r => r.CreatedAt),
            _ => query.OrderBy(r => r.Title)
        };

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
        
        var rules = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new RuleSummary(r.RuleId, r.Title, r.Priority, r.Status))
            .ToArrayAsync();

        var pagination = new PaginationInfo(page, pageSize, totalPages, totalItems);
        return new RulesResponse(rules, pagination);
    }

    public async Task<RuleDetails> CreateRuleAsync(RuleDetails rule)
    {
        var (currentUserId, currentRoles, currentCarrierId) = await GetCurrentUserContextAsync();
        
        // Carrier Users can create rules, but only for their carrier
        if (!IsSuperAdmin(currentRoles) && !IsCarrierAdmin(currentRoles) && !IsCarrierUser(currentRoles))
            throw new UnauthorizedAccessException("Insufficient permissions to create rules");
        
        var ruleId = await _idGenerationService.GenerateRuleIdAsync();
        
        var dbRule = new DbRule
        {
            RuleId = ruleId,
            Title = rule.Title,
            Description = rule.Description,
            BusinessType = rule.BusinessType,
            NaicsCodes = rule.NaicsCodes != null ? string.Join(",", rule.NaicsCodes) : null,
            States = rule.States != null ? string.Join(",", rule.States) : null,
            Carrier = rule.Carrier,
            Product = rule.Product,
            CarrierID = IsSuperAdmin(currentRoles) ? null : currentCarrierId,
            Restrictions = rule.Restrictions != null ? string.Join(",", rule.Restrictions) : null,
            Priority = rule.Priority,
            Outcome = rule.Outcome,
            RuleVersion = rule.RuleVersion,
            Status = rule.Status,
            EffectiveFrom = rule.EffectiveFrom,
            EffectiveTo = rule.EffectiveTo,
            MinRevenue = rule.MinRevenue,
            MaxRevenue = rule.MaxRevenue,
            MinYearsInBusiness = rule.MinYearsInBusiness,
            MaxYearsInBusiness = rule.MaxYearsInBusiness,
            PriorClaimsAllowed = rule.PriorClaimsAllowed,
            Conditions = rule.Conditions != null ? string.Join(",", rule.Conditions) : null,
            ContactEmail = rule.ContactEmail,
            CreatedBy = currentUserId,
            CreatedAt = DateTime.UtcNow,
            AdditionalJson = rule.AdditionalJson
        };
        
        _context.Rules.Add(dbRule);
        await _context.SaveChangesAsync();
        
        return rule with { RuleId = ruleId, CreatedAt = dbRule.CreatedAt, CreatedBy = currentUserId };
    }

    public async Task<RuleDetails> UpdateRuleAsync(string id, RuleDetails rule)
    {
        var dbRule = await _context.Rules.FirstOrDefaultAsync(r => r.RuleId == id);
        if (dbRule == null)
            throw new KeyNotFoundException($"Rule {id} not found");
        
        dbRule.Title = rule.Title;
        dbRule.Description = rule.Description;
        dbRule.BusinessType = rule.BusinessType;
        dbRule.NaicsCodes = rule.NaicsCodes != null ? string.Join(",", rule.NaicsCodes) : null;
        dbRule.States = rule.States != null ? string.Join(",", rule.States) : null;
        dbRule.Carrier = rule.Carrier;
        dbRule.Product = rule.Product;
        dbRule.Restrictions = rule.Restrictions != null ? string.Join(",", rule.Restrictions) : null;
        dbRule.Priority = rule.Priority;
        dbRule.Outcome = rule.Outcome;
        dbRule.RuleVersion = rule.RuleVersion;
        dbRule.Status = rule.Status;
        dbRule.EffectiveFrom = rule.EffectiveFrom;
        dbRule.EffectiveTo = rule.EffectiveTo;
        dbRule.MinRevenue = rule.MinRevenue;
        dbRule.MaxRevenue = rule.MaxRevenue;
        dbRule.MinYearsInBusiness = rule.MinYearsInBusiness;
        dbRule.MaxYearsInBusiness = rule.MaxYearsInBusiness;
        dbRule.PriorClaimsAllowed = rule.PriorClaimsAllowed;
        dbRule.Conditions = rule.Conditions != null ? string.Join(",", rule.Conditions) : null;
        dbRule.ContactEmail = rule.ContactEmail;
        dbRule.UpdatedAt = DateTime.UtcNow;
        dbRule.AdditionalJson = rule.AdditionalJson;
        
        await _context.SaveChangesAsync();
        
        return rule with { UpdatedAt = dbRule.UpdatedAt };
    }

    public async Task DeleteRuleAsync(string id)
    {
        var rule = await _context.Rules.FirstOrDefaultAsync(r => r.RuleId == id);
        if (rule == null)
            throw new KeyNotFoundException($"Rule {id} not found");
        
        _context.Rules.Remove(rule);
        await _context.SaveChangesAsync();
    }

    public async Task<RuleUploadResponse> UploadRulesAsync(IFormFile file, bool overwrite)
    {
        var uploadId = Guid.NewGuid().ToString();
        var errors = new List<UploadError>();
        int created = 0, updated = 0, failed = 0;
        
        try
        {
            using var stream = file.OpenReadStream();
            using var reader = new StreamReader(stream);
            
            string? line;
            int row = 0;
            
            await reader.ReadLineAsync();
            
            while ((line = await reader.ReadLineAsync()) != null)
            {
                row++;
                try
                {
                    var fields = line.Split(',');
                    if (fields.Length < 3)
                    {
                        errors.Add(new UploadError(row, "Insufficient columns"));
                        failed++;
                        continue;
                    }
                    
                    var ruleId = fields[0].Trim();
                    var existingRule = await _context.Rules.FirstOrDefaultAsync(r => r.RuleId == ruleId);
                    
                    if (existingRule != null && !overwrite)
                    {
                        errors.Add(new UploadError(row, "Rule already exists"));
                        failed++;
                        continue;
                    }
                    
                    if (existingRule != null)
                    {
                        existingRule.Title = fields[1].Trim();
                        existingRule.Description = fields.Length > 2 ? fields[2].Trim() : null;
                        existingRule.UpdatedAt = DateTime.UtcNow;
                        updated++;
                    }
                    else
                    {
                        var newRule = new DbRule
                        {
                            RuleId = ruleId,
                            Title = fields[1].Trim(),
                            Description = fields.Length > 2 ? fields[2].Trim() : null,
                            CreatedAt = DateTime.UtcNow,
                            Status = "active"
                        };
                        _context.Rules.Add(newRule);
                        created++;
                    }
                }
                catch (Exception ex)
                {
                    errors.Add(new UploadError(row, ex.Message));
                    failed++;
                }
            }
            
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            errors.Add(new UploadError(0, $"File processing error: {ex.Message}"));
            failed++;
        }
        
        return new RuleUploadResponse(uploadId, "completed", created, updated, failed, 
            errors.ToArray(), $"/api/uploads/{uploadId}/report");
    }

    public async Task<CarrierDetails> GetCarrierDetailsAsync(string id)
    {
        if (!int.TryParse(id, out int carrierId))
            throw new ArgumentException("Invalid carrier ID format");
            
        var carrier = await _context.Carriers.FirstOrDefaultAsync(c => c.CarrierId == carrierId);
        if (carrier == null)
            throw new KeyNotFoundException($"Carrier {id} not found");
        
        return new CarrierDetails(carrier.CarrierId.ToString(), carrier.LegalName, carrier.DisplayName,
            carrier.Country, carrier.HeadquartersAddress, carrier.PrimaryContactName, carrier.PrimaryContactEmail,
            carrier.PrimaryContactPhone, carrier.TechnicalContactName, carrier.TechnicalContactEmail,
            carrier.AuthMethod, carrier.SsoMetadataUrl, carrier.ApiClientId, carrier.ApiSecretKeyRef,
            carrier.DataResidency, carrier.ProductsOffered?.Split(',', StringSplitOptions.RemoveEmptyEntries),
            carrier.RuleUploadAllowed, carrier.RuleUploadMethod, carrier.RuleApprovalRequired,
            carrier.DefaultRuleVersioning, carrier.UseNaicsEnrichment, carrier.PreferredNaicsSource,
            carrier.PasWebhookUrl, carrier.WebhookAuthType, carrier.WebhookSecretRef, carrier.ContractRef,
            carrier.BillingContactEmail, carrier.RetentionPolicyDays, carrier.CreatedBy, carrier.CreatedAt,
            carrier.UpdatedAt, carrier.AdditionalJson);
    }

    public async Task<CarriersResponse> GetCarriersListAsync(int page, int pageSize)
    {
        var (currentUserId, currentRoles, currentCarrierId) = await GetCurrentUserContextAsync();
        
        var query = _context.Carriers.AsQueryable();
        
        // Apply role-based filtering
        if (!IsSuperAdmin(currentRoles))
        {
            query = query.Where(c => c.CarrierId == currentCarrierId);
        }
        
        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
        
        var carriers = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CarrierSummary(c.CarrierId.ToString(), c.LegalName, c.DisplayName, 
                c.Country, c.PrimaryContactEmail))
            .ToArrayAsync();

        var pagination = new PaginationInfo(page, pageSize, totalPages, totalItems);
        return new CarriersResponse(carriers, pagination);
    }

    public async Task<CarrierDetails> CreateCarrierDetailsAsync(CarrierDetails carrier)
    {
        var dbCarrier = new DbCarrier
        {
            LegalName = carrier.LegalName,
            DisplayName = carrier.DisplayName,
            Country = carrier.Country,
            HeadquartersAddress = carrier.HeadquartersAddress,
            PrimaryContactName = carrier.PrimaryContactName,
            PrimaryContactEmail = carrier.PrimaryContactEmail,
            PrimaryContactPhone = carrier.PrimaryContactPhone,
            TechnicalContactName = carrier.TechnicalContactName,
            TechnicalContactEmail = carrier.TechnicalContactEmail,
            AuthMethod = carrier.AuthMethod,
            SsoMetadataUrl = carrier.SsoMetadataUrl,
            ApiClientId = carrier.ApiClientId,
            ApiSecretKeyRef = carrier.ApiSecretKeyRef,
            DataResidency = carrier.DataResidency,
            ProductsOffered = carrier.ProductsOffered != null ? string.Join(",", carrier.ProductsOffered) : null,
            RuleUploadAllowed = carrier.RuleUploadAllowed,
            RuleUploadMethod = carrier.RuleUploadMethod,
            RuleApprovalRequired = carrier.RuleApprovalRequired,
            DefaultRuleVersioning = carrier.DefaultRuleVersioning,
            UseNaicsEnrichment = carrier.UseNaicsEnrichment,
            PreferredNaicsSource = carrier.PreferredNaicsSource,
            PasWebhookUrl = carrier.PasWebhookUrl,
            WebhookAuthType = carrier.WebhookAuthType,
            WebhookSecretRef = carrier.WebhookSecretRef,
            ContractRef = carrier.ContractRef,
            BillingContactEmail = carrier.BillingContactEmail,
            RetentionPolicyDays = carrier.RetentionPolicyDays,
            CreatedBy = carrier.CreatedBy,
            CreatedAt = DateTime.UtcNow,
            AdditionalJson = carrier.AdditionalJson
        };
        
        _context.Carriers.Add(dbCarrier);
        await _context.SaveChangesAsync();
        
        return carrier with { CarrierId = dbCarrier.CarrierId.ToString(), CreatedAt = dbCarrier.CreatedAt };
    }

    public async Task<CarrierDetails> UpdateCarrierDetailsAsync(string id, CarrierDetails carrier)
    {
        if (!int.TryParse(id, out int carrierId))
            throw new ArgumentException("Invalid carrier ID format");
            
        var dbCarrier = await _context.Carriers.FirstOrDefaultAsync(c => c.CarrierId == carrierId);
        if (dbCarrier == null)
            throw new KeyNotFoundException($"Carrier {id} not found");
        
        dbCarrier.LegalName = carrier.LegalName;
        dbCarrier.DisplayName = carrier.DisplayName;
        dbCarrier.Country = carrier.Country;
        dbCarrier.HeadquartersAddress = carrier.HeadquartersAddress;
        dbCarrier.PrimaryContactName = carrier.PrimaryContactName;
        dbCarrier.PrimaryContactEmail = carrier.PrimaryContactEmail;
        dbCarrier.PrimaryContactPhone = carrier.PrimaryContactPhone;
        dbCarrier.TechnicalContactName = carrier.TechnicalContactName;
        dbCarrier.TechnicalContactEmail = carrier.TechnicalContactEmail;
        dbCarrier.AuthMethod = carrier.AuthMethod;
        dbCarrier.SsoMetadataUrl = carrier.SsoMetadataUrl;
        dbCarrier.ApiClientId = carrier.ApiClientId;
        dbCarrier.ApiSecretKeyRef = carrier.ApiSecretKeyRef;
        dbCarrier.DataResidency = carrier.DataResidency;
        dbCarrier.ProductsOffered = carrier.ProductsOffered != null ? string.Join(",", carrier.ProductsOffered) : null;
        dbCarrier.RuleUploadAllowed = carrier.RuleUploadAllowed;
        dbCarrier.RuleUploadMethod = carrier.RuleUploadMethod;
        dbCarrier.RuleApprovalRequired = carrier.RuleApprovalRequired;
        dbCarrier.DefaultRuleVersioning = carrier.DefaultRuleVersioning;
        dbCarrier.UseNaicsEnrichment = carrier.UseNaicsEnrichment;
        dbCarrier.PreferredNaicsSource = carrier.PreferredNaicsSource;
        dbCarrier.PasWebhookUrl = carrier.PasWebhookUrl;
        dbCarrier.WebhookAuthType = carrier.WebhookAuthType;
        dbCarrier.WebhookSecretRef = carrier.WebhookSecretRef;
        dbCarrier.ContractRef = carrier.ContractRef;
        dbCarrier.BillingContactEmail = carrier.BillingContactEmail;
        dbCarrier.RetentionPolicyDays = carrier.RetentionPolicyDays;
        dbCarrier.UpdatedAt = DateTime.UtcNow;
        dbCarrier.AdditionalJson = carrier.AdditionalJson;
        
        await _context.SaveChangesAsync();
        
        return carrier with { UpdatedAt = dbCarrier.UpdatedAt };
    }

    public async Task DeleteCarrierDetailsAsync(string id)
    {
        if (!int.TryParse(id, out int carrierId))
            throw new ArgumentException("Invalid carrier ID format");
            
        var carrier = await _context.Carriers.FirstOrDefaultAsync(c => c.CarrierId == carrierId);
        if (carrier == null)
            throw new KeyNotFoundException($"Carrier {id} not found");
        
        _context.Carriers.Remove(carrier);
        await _context.SaveChangesAsync();
    }

    public async Task<CanvasAnalyticsResponse> GetAnalyticsAsync(DateTime? since)
    {
        var (currentUserId, currentRoles, currentCarrierId) = await GetCurrentUserContextAsync();
        var sinceDate = since ?? DateTime.UtcNow.AddDays(-30);
        
        // Apply role-based filtering
        var rulesQuery = _context.Rules.AsQueryable();
        var usersQuery = _context.Users.AsQueryable();
        var carriersQuery = _context.Carriers.AsQueryable();
        var productsQuery = _context.Products.AsQueryable();
        
        if (!IsSuperAdmin(currentRoles))
        {
            // Filter data to current user's carrier
            rulesQuery = rulesQuery.Where(r => r.CarrierID == currentCarrierId);
            usersQuery = usersQuery.Where(u => u.CarrierID == currentCarrierId);
            carriersQuery = carriersQuery.Where(c => c.CarrierId == currentCarrierId);
            productsQuery = productsQuery.Where(p => p.CarrierID == currentCarrierId);
        }
        
        var totalRules = await rulesQuery.CountAsync();
        var totalUsers = await usersQuery.CountAsync();
        var totalCarriers = await carriersQuery.CountAsync();
        var totalProducts = await productsQuery.CountAsync();
        
        var rulesByPriority = await rulesQuery
            .Where(r => r.Priority != null)
            .GroupBy(r => r.Priority)
            .ToDictionaryAsync(g => g.Key!, g => g.Count());
            
        var productsByCarrier = await productsQuery
            .GroupBy(p => p.Carrier)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
            
        var usersByRole = await usersQuery
            .Where(u => u.Roles != null)
            .GroupBy(u => u.Roles)
            .ToDictionaryAsync(g => g.Key!, g => g.Count());
        
        var recentUploads = await rulesQuery
            .Where(r => r.CreatedAt >= sinceDate)
            .CountAsync();
        
        var growthData = new List<RealGrowthData>();
        for (int i = 29; i >= 0; i--)
        {
            var date = DateTime.UtcNow.AddDays(-i);
            var usersCount = await usersQuery.Where(u => u.CreatedAt <= date).CountAsync();
            var rulesCount = await rulesQuery.Where(r => r.CreatedAt <= date).CountAsync();
            var carriersCount = await carriersQuery.Where(c => c.CreatedAt <= date).CountAsync();
            
            growthData.Add(new RealGrowthData(date.ToString("yyyy-MM-dd"), usersCount, rulesCount, carriersCount));
        }
        
        var metrics = new CanvasMetrics(totalRules, rulesByPriority, productsByCarrier, recentUploads,
            totalUsers, totalCarriers, totalProducts, usersByRole, growthData.ToArray());
        
        return new CanvasAnalyticsResponse(DateTime.UtcNow, metrics, "/powerbi/embed/analytics");
    }

    public async Task<CreateUserResponse> CreateUserAsync(CreateUserRequest request)
    {
        var (currentUserId, currentRoles, currentCarrierId) = await GetCurrentUserContextAsync();
        
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existingUser != null)
            throw new InvalidOperationException("User with this email already exists");
        
        var userId = await _idGenerationService.GenerateUserIdAsync();
        var tempPassword = GenerateTemporaryPassword();
        var hashedPassword = _passwordService.HashPassword(tempPassword);
        
        // Determine CarrierID based on current user role and request
        int? carrierIdToAssign = null;
        string? organizationName = null;
        
        if (IsSuperAdmin(currentRoles))
        {
            // Super Admin can assign any CarrierID
            carrierIdToAssign = request.CarrierID;
            if (carrierIdToAssign.HasValue)
            {
                var carrier = await _context.Carriers.FirstOrDefaultAsync(c => c.CarrierId == carrierIdToAssign);
                organizationName = carrier?.DisplayName;
            }
        }
        else if (IsCarrierAdmin(currentRoles))
        {
            // Carrier Admin can only create users for their own carrier
            carrierIdToAssign = currentCarrierId;
            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId);
            organizationName = currentUser?.OrganizationName;
        }
        
        var newUser = new DbUser
        {
            Id = userId,
            Name = request.Name,
            Email = request.Email,
            PasswordHash = hashedPassword,
            Roles = request.Role,
            CarrierID = carrierIdToAssign,
            OrganizationName = organizationName,
            CreatedAt = DateTime.UtcNow,
            IsActive = true,
            AuthProvider = "local"
        };
        
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();
        
        return new CreateUserResponse(userId, request.Email, tempPassword, 
            "User created successfully. Please share the temporary password securely.");
    }
}