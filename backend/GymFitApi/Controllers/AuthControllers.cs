using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using GymFitApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GymFitApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    [HttpPost("register-full")]
    public async Task<IActionResult> RegisterFull([FromBody] RegisterDto dto)
    {
        var user = new AppUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName
        };

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (result.Succeeded)
        {
            return Ok(new { message = "Account created successfully!" });
        }

        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        var roles = await _userManager.GetRolesAsync(user);
        var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        foreach (var role in roles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, role));
        }

        var jwtSecret = _configuration["Jwt:Secret"] ?? "SuperSecretKeyThatIsLongEnoughToSatisfySecurityRequirements123!";
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:ValidIssuer"],
            audience: _configuration["Jwt:ValidAudience"],
            expires: DateTime.Now.AddDays(3),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            expiration = token.ValidTo
        });
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var user = await _userManager.GetUserAsync(User);
        
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        var roles = await _userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? "User";

        return Ok(new
        {
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            role = primaryRole
        });
    }

    [HttpPost("make-admin")]
    public async Task<IActionResult> MakeAdmin([FromBody] string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        
        if (user == null) 
        {
            return NotFound(new { message = "User not found." });
        }

        if (!await _roleManager.RoleExistsAsync("Admin"))
        {
            await _roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        if (!await _userManager.IsInRoleAsync(user, "Admin"))
        {
            await _userManager.AddToRoleAsync(user, "Admin");
        }

        return Ok(new { message = $"User {email} is now an Admin!" });
    }
}

public class RegisterDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}