using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services;

public class AuthService
{
    private readonly IConfiguration _config;
    private readonly ApplicationDbContext _context;

    public AuthService(IConfiguration config, ApplicationDbContext context)
    {
        _config = config;
        _context = context;
    }

    public AuthResponse? Login(AuthRequest request)
    {
        Console.WriteLine($"[AuthService] Intentando login para correo: {request.Correo}");
        // Intentar encontrar el usuario por correo
        var user = _context.Usuarios.FirstOrDefault(u => u.Correo == request.Correo);
        
        if (user == null)
        {
            Console.WriteLine("[AuthService] Usuario no encontrado.");
            return null;
        }
        
        Console.WriteLine($"[AuthService] Usuario encontrado: {user.Correo}. Verificando contraseña...");
        
        // TEMPORAL: Bypass de contraseña para usuario administrador
        //bool passwordMatch = false; // Código de bypass eliminado
        //if (request.Correo == "admin@psicologia.com") // Código de bypass eliminado
        //{
        //    Console.WriteLine("[AuthService] Bypass de contraseña activado para admin."); // Código de bypass eliminado
        //    passwordMatch = true; // Siempre verdadero para admin con bypass // Código de bypass eliminado
        //} // Código de bypass eliminado
        //else // Código de bypass eliminado
        //{
            bool passwordMatch = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        //}

        if (!passwordMatch)
        {
            Console.WriteLine("[AuthService] Contraseña incorrecta.");
            return null;
        }

        Console.WriteLine("[AuthService] Contraseña verificada. Generando token...");
        var token = GenerateJwtToken(user);

        Console.WriteLine("[AuthService] Token generado. Retornando respuesta.");
        return new AuthResponse
        {
            Token = token,
            Rol = user.Rol,
            NombreCompleto = user.NombreCompleto
        };
    }

    public async Task<RegistroResponse> RegistrarUsuario(RegistroRequest request)
    {
        // Verificar si el correo ya está registrado
        if (await _context.Usuarios.AnyAsync(u => u.Correo == request.Correo))
        {
            return new RegistroResponse
            {
                Success = false,
                Message = "El correo electrónico ya está registrado"
            };
        }

        // Validar rol
        if (request.Rol != "psicologo" && request.Rol != "admin")
        {
            return new RegistroResponse
            {
                Success = false,
                Message = "Rol no válido"
            };
        }

        // Crear nuevo usuario
        var usuario = new Usuario
        {
            NombreCompleto = request.NombreCompleto,
            Correo = request.Correo,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Rol = request.Rol,
            CreadoEn = DateTime.UtcNow
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return new RegistroResponse
        {
            Success = true,
            Message = "Usuario registrado exitosamente"
        };
    }

    private string GenerateJwtToken(Usuario usuario)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, usuario.NombreCompleto),
            new Claim(ClaimTypes.Email, usuario.Correo),
            new Claim(ClaimTypes.Role, usuario.Rol)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
