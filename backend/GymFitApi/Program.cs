using GymFitApi.Data;
using Microsoft.EntityFrameworkCore;
using GymFitApi.Middlware;
using Microsoft.AspNetCore.Identity;
using GymFitApi.Models;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy => {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "CheiaMeaSecretaSiFoarteLungaDePeste32DeCaracterePentruGymFit2026!";
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:ValidIssuer"],
        ValidAudience = builder.Configuration["Jwt:ValidAudience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddAuthorization();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Logging.ClearProviders();
builder.Logging.AddLog4Net("log4net.config");

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IEmailSender<AppUser>, NoOpEmailSender>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();
app.UseHttpsRedirection();

app.UseCors("AllowReact");

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();

public class NoOpEmailSender : IEmailSender<AppUser>
{
    public Task SendConfirmationLinkAsync(AppUser user, string email, string confirmationLink) => Task.CompletedTask;
    public Task SendPasswordResetCodeAsync(AppUser user, string email, string resetCode) => Task.CompletedTask;
    public Task SendPasswordResetLinkAsync(AppUser user, string email, string resetLink) => Task.CompletedTask;
}