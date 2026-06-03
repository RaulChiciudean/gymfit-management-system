using System.ComponentModel.DataAnnotations;

namespace GymFitApi.Models
{
    public class Booking
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }
        public AppUser User { get; set; }

    
        [Required]
        public string ClassId { get; set; } 
        [Required]
        public string ClassName { get; set; }
        [Required]
        public string Day { get; set; }
        public int Duration { get; set; }

        public DateTime BookedAt { get; set; } = DateTime.UtcNow;
    }
}