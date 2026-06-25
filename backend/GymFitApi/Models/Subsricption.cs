using GymFitApi.Models;

namespace GymFitApi.Models;

public class Subscription
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public AppUser User { get; set; }
    
    public MembershipTier Tier { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public decimal AmountPaid { get; set; }
    public bool IsActive { get; set; }
}