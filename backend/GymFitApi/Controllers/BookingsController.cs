using GymFitApi.Data;
using GymFitApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymFitApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public BookingsController(AppDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyBookings()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var bookings = await _context.Bookings
                .Where(b => b.UserId == user.Id)
                .OrderBy(b => b.Day)
                .Select(b => new {
                    b.Id,
                    b.ClassId,
                    b.ClassName,
                    b.Day,
                    b.Duration
                })
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequestDto request)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            // --- LOGICĂ NOUĂ: Verificarea abonamentului ---
            int limit = user.Tier == MembershipTier.Elite ? int.MaxValue : 10;
            var currentBookingsCount = await _context.Bookings.CountAsync(b => b.UserId == user.Id);

            if (currentBookingsCount >= limit)
            {
                return BadRequest(new { 
                    message = $"Ai atins limita de {limit} clase inclusă în abonamentul tău {user.Tier}. Upgrade la Elite pentru antrenamente nelimitate!" 
                });
            }
            // ----------------------------------------------

            var exists = await _context.Bookings.AnyAsync(b => 
                b.UserId == user.Id && b.ClassId == request.ClassId && b.Day == request.Day);
            
            if (exists) 
                return BadRequest(new { message = "You already have a booking for this class on this day." });

            if (!int.TryParse(request.ClassId, out int sportClassId))
            {
                return BadRequest(new { message = "Invalid class ID format." });
            }

            var sportClass = await _context.SportClasses.FirstOrDefaultAsync(c => c.Id == sportClassId);
            if (sportClass == null) return NotFound(new { message = "Class not found." });

            int currentEnrolled = GetEnrolledCount(sportClass, request.Day);
            int maxCapacity = sportClass.MaxCapacity > 0 ? sportClass.MaxCapacity : 20;

            if (currentEnrolled >= maxCapacity)
            {
                return BadRequest(new { message = "This class is full for the selected day." });
            }

            UpdateEnrolledCount(sportClass, request.Day, 1);

            var booking = new Booking
            {
                UserId = user.Id,
                ClassId = request.ClassId,
                ClassName = request.ClassName,
                Day = request.Day,
                Duration = request.Duration
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return Ok(booking);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id && b.UserId == user.Id);
            if (booking == null) return NotFound(new { message = "Booking not found." });

            if (int.TryParse(booking.ClassId, out int sportClassId))
            {
                var sportClass = await _context.SportClasses.FirstOrDefaultAsync(c => c.Id == sportClassId);
                if (sportClass != null)
                {
                    UpdateEnrolledCount(sportClass, booking.Day, -1);
                }
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking cancelled successfully!" });
        }

        private int GetEnrolledCount(SportClass sportClass, string day)
        {
            return day.ToLower() switch
            {
                "monday" => sportClass.EnrolledMonday,
                "tuesday" => sportClass.EnrolledTuesday,
                "wednesday" => sportClass.EnrolledWednesday,
                "thursday" => sportClass.EnrolledThursday,
                "friday" => sportClass.EnrolledFriday,
                "saturday" => sportClass.EnrolledSaturday,
                "sunday" => sportClass.EnrolledSunday,
                _ => 0
            };
        }

        private void UpdateEnrolledCount(SportClass sportClass, string day, int amount)
        {
            switch (day.ToLower())
            {
                case "monday": sportClass.EnrolledMonday = Math.Max(0, sportClass.EnrolledMonday + amount); break;
                case "tuesday": sportClass.EnrolledTuesday = Math.Max(0, sportClass.EnrolledTuesday + amount); break;
                case "wednesday": sportClass.EnrolledWednesday = Math.Max(0, sportClass.EnrolledWednesday + amount); break;
                case "thursday": sportClass.EnrolledThursday = Math.Max(0, sportClass.EnrolledThursday + amount); break;
                case "friday": sportClass.EnrolledFriday = Math.Max(0, sportClass.EnrolledFriday + amount); break;
                case "saturday": sportClass.EnrolledSaturday = Math.Max(0, sportClass.EnrolledSaturday + amount); break;
                case "sunday": sportClass.EnrolledSunday = Math.Max(0, sportClass.EnrolledSunday + amount); break;
            }
        }
    }

    public class BookingRequestDto
    {
        public string ClassId { get; set; }
        public string ClassName { get; set; }
        public string Day { get; set; }
        public int Duration { get; set; }
    }
}