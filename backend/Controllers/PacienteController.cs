using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PacienteController : ControllerBase
{
    private readonly PacienteService _pacienteService;

    public PacienteController(PacienteService pacienteService)
    {
        _pacienteService = pacienteService;
    }

    [HttpGet]
    public async Task<ActionResult<PacientesResponse>> GetPacientes([FromQuery] int pagina = 1, [FromQuery] int itemsPorPagina = 10)
    {
        var result = await _pacienteService.GetPacientes(pagina, itemsPorPagina);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PacienteResponse>> GetPaciente(int id)
    {
        var result = await _pacienteService.GetPaciente(id);
        if (result == null)
            return NotFound(new { message = "Paciente no encontrado" });

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<PacienteResponse>> CrearPaciente([FromBody] PacienteRequest request)
    {
        var result = await _pacienteService.CrearPaciente(request);
        return CreatedAtAction(nameof(GetPaciente), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PacienteResponse>> ActualizarPaciente(int id, [FromBody] PacienteRequest request)
    {
        var result = await _pacienteService.ActualizarPaciente(id, request);
        if (result == null)
            return NotFound(new { message = "Paciente no encontrado" });

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> EliminarPaciente(int id)
    {
        var result = await _pacienteService.EliminarPaciente(id);
        if (!result)
            return NotFound(new { message = "Paciente no encontrado" });

        return NoContent();
    }

    [HttpPatch("{id}/estado")]
    public async Task<ActionResult<PacienteResponse>> CambiarEstado(int id)
    {
        var result = await _pacienteService.CambiarEstado(id);
        if (result == null)
            return NotFound(new { message = "Paciente no encontrado" });

        return Ok(result);
    }
} 