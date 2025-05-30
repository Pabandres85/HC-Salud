using Backend.Data;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Npgsql.EntityFrameworkCore.PostgreSQL;
//using Npgsql.EntityFrameworkCore.PostgreSQL.Naming; // Eliminado: No necesario con EntityFrameworkCore.NamingConventions
//using EntityFrameworkCore.NamingConventions; // Eliminado: Removimos la dependencia

var builder = WebApplication.CreateBuilder(args);

// Configuración de EF Core con PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    //options.UseSnakeCaseNamingConvention(); // Eliminado: Usaremos mapeo manual o convenciones por defecto
    options.EnableSensitiveDataLogging(); // Para desarrollo
    options.EnableDetailedErrors(); // Para desarrollo
});

// Configuración de logging más detallada
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Information);

// Inyección de dependencias
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<PacienteService>();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = builder.Configuration["Jwt:Key"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!))
        };
    });

// Configuraciones comunes
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Escuchar en todas las IPs dentro del contenedor (requisito para Docker)
builder.WebHost.UseUrls("http://0.0.0.0:5000");

var app = builder.Build();

// Middleware: habilita Swagger siempre
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Psicología v1");
    c.RoutePrefix = "swagger"; // accesible en /swagger
});

// Usar CORS antes de autenticación y autorización
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Validar la conexión a la base de datos al inicio
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.OpenConnection();
        app.Logger.LogInformation("Conexión a la base de datos establecida correctamente");
        
        // Verificar si las tablas existen
        var tablas = context.Database.SqlQuery<string>($"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'").ToList();
        app.Logger.LogInformation("Tablas en la base de datos: {Tablas}", string.Join(", ", tablas));
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Error al conectar con la base de datos");
        throw;
    }
}

app.Run();
