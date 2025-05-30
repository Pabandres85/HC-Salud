using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HistoriaClinicaController : ControllerBase
{
    private readonly HistoriaClinicaService _historiaClinicaService;

    public HistoriaClinicaController(HistoriaClinicaService historiaClinicaService)
    {
        _historiaClinicaService = historiaClinicaService;
    }

    // GET: api/HistoriaClinica/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<HistoriaClinicaResponse>> GetHistoriaClinica(int id)
    {
        var historia = await _historiaClinicaService.GetHistoriaClinica(id);
        if (historia == null)
        {
            return NotFound(new { message = "Historia clínica no encontrada" });
        }
        return Ok(historia);
    }

    // GET: api/HistoriaClinica/paciente/{pacienteId}
    [HttpGet("paciente/{pacienteId}")]
    public async Task<ActionResult<HistoriasClinicasResponse>> GetHistoriasClinicasByPaciente(
        int pacienteId, [FromQuery] int pagina = 1, [FromQuery] int itemsPorPagina = 10)
    {
        var historias = await _historiaClinicaService.GetHistoriasClinicasByPaciente(pacienteId, pagina, itemsPorPagina);
        return Ok(historias);
    }

    // POST: api/HistoriaClinica
    [HttpPost]
    public async Task<ActionResult<HistoriaClinicaResponse>> CrearHistoriaClinica([FromBody] HistoriaClinicaRequest request)
    {
        var nuevaHistoria = await _historiaClinicaService.CrearHistoriaClinica(request);
        return CreatedAtAction(nameof(GetHistoriaClinica), new { id = nuevaHistoria.Id }, nuevaHistoria);
    }

    // PUT: api/HistoriaClinica/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> ActualizarHistoriaClinica(int id, [FromBody] HistoriaClinicaRequest request)
    {
        var resultado = await _historiaClinicaService.ActualizarHistoriaClinica(id, request);
        if (resultado == null)
        {
            return NotFound(new { message = "Historia clínica no encontrada" });
        }
        return NoContent(); // O retornar el objeto actualizado si es necesario
    }

    // DELETE: api/HistoriaClinica/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> EliminarHistoriaClinica(int id)
    {
        var eliminado = await _historiaClinicaService.EliminarHistoriaClinica(id);
        if (!eliminado)
        {
            return NotFound(new { message = "Historia clínica no encontrada" });
        }
        return NoContent();
    }
} 