using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CitaController : ControllerBase
    {
        private readonly CitaService _citaService;

        public CitaController(CitaService citaService)
        {
            _citaService = citaService;
        }

        [HttpPost]
        public async Task<ActionResult<CitaResponse>> CreateCita([FromBody] CitaRequest request)
        {
            try
            {
                var cita = await _citaService.CreateCitaAsync(request);
                return CreatedAtAction(nameof(GetCitaById), new { id = cita.Id }, cita);
            }
            catch (Exception ex)
            {
                 return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CitaResponse>> GetCitaById(int id)
        {
            var cita = await _citaService.GetCitaByIdAsync(id);
            if (cita == null)
            {
                return NotFound(new { message = "Cita no encontrada" });
            }
            return Ok(cita);
        }

        [HttpGet("byPaciente/{pacienteId}")]
        public async Task<ActionResult<IEnumerable<CitaResponse>>> GetCitasByPacienteId(int pacienteId)
        {
             try
            {
                var citas = await _citaService.GetCitasByPacienteIdAsync(pacienteId);
                return Ok(citas);
            }
             catch (Exception ex)
            {
                 return BadRequest(new { message = ex.Message });
            }
        }

        // No necesitamos un endpoint para GetCitasForDateAsync aquí, ya que es para uso interno del DashboardController

        [HttpPut("{id}")]
        public async Task<ActionResult<CitaResponse>> UpdateCita(int id, [FromBody] CitaRequest request)
        {
            try
            {
                var updatedCita = await _citaService.UpdateCitaAsync(id, request);
                 if (updatedCita == null)
                {
                    return NotFound(new { message = "Cita no encontrada" });
                }
                return Ok(updatedCita);
            }
             catch (Exception ex)
            {
                 return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCita(int id)
        {
            var deleted = await _citaService.DeleteCitaAsync(id);
            if (!deleted)
            {
                return NotFound(new { message = "Cita no encontrada" });
            }
            return NoContent();
        }
    }
} 