using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using UykusuzPenApi.Data;
using UykusuzPenApi.Services;
using UykusuzPenApi.Services.Interfaces;
using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;
using UykusuzPenApi.Models;
using EFCore.NamingConventions; 

var builder = WebApplication.CreateBuilder(args);

// JSON options
builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Memory cache
builder.Services.AddMemoryCache();

// Entity Framework (MySQL)
builder.Services.AddDbContext<UykusuzPenDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection")),
        mySqlOptions => mySqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)
    )
    .UseSnakeCaseNamingConvention() 
);

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    jwtKey = "supersecretkey123_superfallback_change_this_!!!!!!"; 
}
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateIssuer = !string.IsNullOrWhiteSpace(builder.Configuration["JwtSettings:Issuer"]),
        ValidateAudience = !string.IsNullOrWhiteSpace(builder.Configuration["JwtSettings:Audience"]),
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
    
    // --- Cookie'yi Okumak İçin ---
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            context.Token = context.Request.Cookies["adminToken"]; // Cookie'nin adı
            return Task.CompletedTask;
        }
    };
    // ---------------------------------
});

// Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireRole("Admin");
    });
});

// --- CORS Politikası ---
var MyReactAppOrigin = "http://localhost:3000"; 

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", 
        policy =>
        {
            policy
                .WithOrigins(MyReactAppOrigin) // React'in adresi
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials(); // Cookie için bu ŞART
        });
});
// ---------------------------------

// Services
builder.Services.AddScoped<IGaleriService, GaleriService>();
builder.Services.AddScoped<IUrunService, UrunService>();
builder.Services.AddSingleton<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Swagger + JWT
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

// Seed initial admin
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var db = services.GetRequiredService<UykusuzPenDbContext>();
        if (!db.AdminUsers.Any())
        {
            var userName = builder.Configuration["InitialAdmin:UserName"] ?? "admin";
            var plainPassword = builder.Configuration["InitialAdmin:Password"] ?? "GüçlüAdminŞifre123!";
            var hashed = BCrypt.Net.BCrypt.HashPassword(plainPassword);
            db.AdminUsers.Add(new AdminUser
            {
                UserName = userName,
                Password = hashed,
                FailedLoginCount = 0,
                LockoutEnd = null
            });
            db.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetService<ILogger<Program>>();
        logger?.LogError(ex, "Seed admin sırasında hata oluştu.");
    }
}

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseRouting();

// --- CORS Politikası ---
app.UseCors("AllowReactApp"); 
// ---------------------------------

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

