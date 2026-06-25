using System.ComponentModel.DataAnnotations;

namespace GymFitApi.Models;

public class SportClass
{
    public int Id { get; set; }

    [Required(ErrorMessage = "The name is mandatory")]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    public int Duration { get; set; }


    public int TrainerId { get; set; }

    public string? ImageUrl { get; set; }
    
    public Trainer? Trainer { get; set; }

    public int MaxCapacity { get; set; } = 20;
    public int EnrolledMonday { get; set; } = 0;
    public int EnrolledTuesday { get; set; } = 0;
    public int EnrolledWednesday { get; set; } = 0;
    public int EnrolledThursday { get; set; } = 0;
    public int EnrolledFriday { get; set; } = 0;
    public int EnrolledSaturday { get; set; } = 0;

    public int EnrolledSunday { get; set; } = 0;
    
}