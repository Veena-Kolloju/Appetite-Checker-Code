using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MyWebApi.Models;

namespace MyWebApi.Services;

public interface IJwtService
{
    string GenerateToken(DbUser user);
    ClaimsPrincipal? ValidateToken(string token);
}

public class JwtService : IJwtService
{
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expirationMinutes;

    public JwtService(IConfiguration configuration)
    {
        _secretKey = configuration["Jwt:SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is required");
        _issuer = configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer is required");
        _audience = configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience is required");
        
        if (!int.TryParse(configuration["Jwt:ExpirationMinutes"], out _expirationMinutes))
        {
            _expirationMinutes = 60;
        }
        
        if (_secretKey.Length < 32)
        {
            throw new InvalidOperationException("JWT SecretKey must be at least 32 characters long");
        }
    }

    public string GenerateToken(DbUser user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_secretKey);
        
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new("sub", user.Id), // Standard JWT subject claim
            new("id", user.Id), // Alternative ID claim
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Email, user.Email),
            new("carrier_id", user.CarrierID?.ToString() ?? ""),
            new("organization_name", user.OrganizationName ?? ""),
            new("auth_provider", user.AuthProvider ?? "local")
        };

        // Add roles
        if (!string.IsNullOrEmpty(user.Roles))
        {
            var roles = user.Roles.Split(',', StringSplitOptions.RemoveEmptyEntries);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role.Trim()));
            }
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_expirationMinutes),
            Issuer = _issuer,
            Audience = _audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _issuer,
                ValidateAudience = true,
                ValidAudience = _audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
            return principal;
        }
        catch
        {
            return null;
        }
    }
}