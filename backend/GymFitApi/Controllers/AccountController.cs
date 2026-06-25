using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Necesar pentru .ToListAsync()
using GymFitApi.Models;
using GymFitApi.Data; // Necesar pentru AppDbContext

namespace GymFitApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly AppDbContext _context;

    
        public AccountController(UserManager<AppUser> userManager, AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpPost("upgrade")]
public async Task<IActionResult> UpgradeToElite()
{
    var user = await _userManager.GetUserAsync(User);
    if (user == null) return Unauthorized();

    user.Tier = MembershipTier.Elite;
    
    await _userManager.UpdateAsync(user);
    await _context.SaveChangesAsync();
    
    return Ok();
}

        [HttpGet("subscription-history")]
        public async Task<IActionResult> GetSubscriptionHistory()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var history = await _context.Subscriptions
                .Where(s => s.UserId == user.Id)
                .OrderByDescending(s => s.StartDate)
                .Select(s => new {
                    s.Id,
                    s.Tier,
                    StartDate = s.StartDate,
                    ExpiryDate = s.ExpiryDate,
                    AmountPaid = s.AmountPaid,
                    IsActive = s.IsActive
                })
                .ToListAsync();

            return Ok(history);
        }

    [HttpPost("activate-pro")]
    public async Task<IActionResult> ActivatePro(){
    var user = await _userManager.GetUserAsync(User);
    if (user == null) return Unauthorized();

    user.Tier = MembershipTier.Pro;
    
    var subscription = new Subscription
    {
        UserId = user.Id,
        Tier = MembershipTier.Pro,
        StartDate = DateTime.UtcNow,
        ExpiryDate = DateTime.UtcNow.AddMonths(1),
        AmountPaid = 0.00m, // Abonament gratuit
        IsActive = true
    };

    _context.Subscriptions.Add(subscription);
    await _userManager.UpdateAsync(user);
    await _context.SaveChangesAsync();

    return Ok(new { message = "Pro plan activated!" });
}

[HttpGet("users")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> GetAllUsers() 
{
    // Extragem strict datele necesare pentru Dashboard (fără parole sau date sensibile)
    var users = await _context.Users
        .Select(u => new 
        {
            Email = u.Email,
            MembershipTier = u.Tier.ToString() // Convertim Tier-ul ca să se potrivească perfect cu React-ul
        })
        .ToListAsync();
        
    return Ok(users);
}

}

}