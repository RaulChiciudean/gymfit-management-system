using Microsoft.AspNetCore.Mvc;
using GymFitApi.Models;
using GymFitApi.Data; 
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace GymFitApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SportClassController : ControllerBase
{
    private readonly ILogger<SportClassController> _logger;
    private readonly AppDbContext _context; 

    public SportClassController(ILogger<SportClassController> logger, AppDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SportClass>>> GetSportClasses()
    {
        return await _context.SportClasses.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SportClass>> GetSportClass(int id)
    {
        var sportClass = await _context.SportClasses
            .Include(s => s.Trainer) 
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sportClass == null) return NotFound();

        return sportClass;
    }

    [HttpPost]
    public async Task<ActionResult<SportClass>> PostSportClass(SportClass sportClass)
    {
        _logger.LogInformation("Adăugare clasă nouă: {Title}", sportClass.Name);

        _context.SportClasses.Add(sportClass);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSportClass), new { id = sportClass.Id }, sportClass);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSportClass(int id)
    {
        var sportClass = await _context.SportClasses.FindAsync(id);
        if (sportClass == null) return NotFound(); 

        _context.SportClasses.Remove(sportClass);
        await _context.SaveChangesAsync(); 

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutSportClass(int id, SportClass sportClass)
    {
        if (id != sportClass.Id)
        {
            return BadRequest("The ID from URL doesn't match with the one from the object.");
        }

        _context.Entry(sportClass).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync(); 
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.SportClasses.Any(e => e.Id == id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    [HttpPost("{id}/book")]
    public async Task<IActionResult> BookClass(int id, [FromQuery] string day)
    {
        var sportClass = await _context.SportClasses.FindAsync(id);
        if (sportClass == null) return NotFound("The class has not been found.");

        // Verificăm capacitatea dinamic în funcție de ziua primită din React
        int currentEnrolled = day switch
        {
            "Monday" => sportClass.EnrolledMonday,
            "Tuesday" => sportClass.EnrolledTuesday,
            "Wednesday" => sportClass.EnrolledWednesday,
            "Thursday" => sportClass.EnrolledThursday,
            "Friday" => sportClass.EnrolledFriday,
            "Saturday" => sportClass.EnrolledSaturday,
            _ => -1
        };

        if (currentEnrolled == -1) return BadRequest("Invalid day selected.");
        if (currentEnrolled >= sportClass.MaxCapacity) return BadRequest("No more available seats for this day!");

        switch (day)
        {
            case "Monday": sportClass.EnrolledMonday++; break;
            case "Tuesday": sportClass.EnrolledTuesday++; break;
            case "Wednesday": sportClass.EnrolledWednesday++; break;
            case "Thursday": sportClass.EnrolledThursday++; break;
            case "Friday": sportClass.EnrolledFriday++; break;
            case "Saturday": sportClass.EnrolledSaturday++; break;
        }

        await _context.SaveChangesAsync();
        return Ok(sportClass); // Returnăm obiectul actualizat ca React să-și ia noile valori instant
    }
}