using System.ComponentModel.DataAnnotations;

namespace GymFitApi.Models;
    public class Trainer
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "The first name is mandatory")]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "The last name is mandatory")]
        public string LastName { get; set; } = string.Empty;

        [Range(0, 50, ErrorMessage = "The experience has to be between 0 and 50 years")]
        public int YearsOfExp { get; set; }
        public string ImageUrl { get; set; } = string.Empty;

        public List<SportClass>? Workouts {get;set;} = new();

    }