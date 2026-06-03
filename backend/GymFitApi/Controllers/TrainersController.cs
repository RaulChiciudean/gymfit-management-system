using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymFitApi.Data;
using GymFitApi.Models;
using System.Linq.Expressions;
using System.Security.Cryptography.X509Certificates;

namespace GymFitApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TrainersController: ControllerBase
{
    private readonly AppDbContext _context;

    public TrainersController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Trainer>>> GetTrainers()
    {
        return await _context.Trainers.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Trainer>> GetTrainer(int id)
    {
        var trainer = await _context.Trainers.FindAsync(id);
        if(trainer == null) return NotFound();
        return trainer;
    }

    [HttpPost]
    public async Task<ActionResult<Trainer>> PostTrainer(Trainer trainer)
    {
        _context.Trainers.Add(trainer);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTrainer), new {id = trainer.Id}, trainer);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutTrainer(int id, Trainer trainer)
    {
        if (id != trainer.Id) return BadRequest();
        _context.Entry(trainer).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if(!_context.Trainers.Any(e=> e.Id == id)) return NotFound();
            else throw;
        }
        return NoContent();
    }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrainer(int id)
        {
            var trainer = await _context.Trainers.FindAsync(id);
            if(trainer == null) return NotFound();

            _context.Trainers.Remove(trainer);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }