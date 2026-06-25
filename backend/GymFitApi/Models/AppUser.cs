using Microsoft.AspNetCore.Identity;

namespace GymFitApi.Models;

public enum MembershipTier
{
    Pro,
    Elite
}
public class AppUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public MembershipTier Tier { get; set; } = MembershipTier.Pro;
}