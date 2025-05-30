using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly IHostEnvironment _env;

    public AuthController(AuthService authService, IHostEnvironment env)
    {
        _authService = authService;
        _env = env;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] AuthRequest request)
    {
        var response = _authService.Login(request);
        if (response == null)
        {
            return Unauthorized(new { message = "Credenciales inválidas" });
        }
        return Ok(response);
    }

    [HttpPost("registro")]
    public async Task<IActionResult> Registro([FromBody] RegistroRequest request)
    {
        var response = await _authService.RegistrarUsuario(request);
        if (!response.Success)
        {
            return BadRequest(new { message = response.Message });
        }
        return Ok(new { message = response.Message });
    }

    // Endpoint TEMPORAL para generar hash de contraseña
    // SOLO usar en desarrollo y eliminar inmediatamente después de usar.
    //[HttpGet("hashpassword")] // Endpoint comentado
    //public IActionResult GetPasswordHash([FromQuery] string password) // Código comentado
    //{
    //    // Asegurarse de que este endpoint SOLO esté disponible en entorno de desarrollo // Código comentado
    //    if (!_env.IsDevelopment()) // Código comentado
    //    {
    //        return NotFound(); // No exponer en producción // Código comentado
    //    } // Código comentado

    //    if (string.IsNullOrEmpty(password)) // Código comentado
    //    {
    //        return BadRequest("La contraseña no puede estar vacía."); // Código comentado
    //    } // Código comentado

    //    try // Código comentado
    //    {
    //        string hash = BCrypt.Net.BCrypt.HashPassword(password); // Código comentado
    //        return Ok(new { password, hash }); // Código comentado
    //    } // Código comentado
    //    catch (Exception ex) // Código comentado
    //    {
    //        return StatusCode(500, new { message = "Error al generar el hash", error = ex.Message }); // Código comentado
    //    } // Código comentado
    //} // Código comentado
}
