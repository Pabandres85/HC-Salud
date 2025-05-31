using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Authorize] // Asegurar que solo usuarios autenticados puedan acceder
    [ApiController]
    [Route("api/[controller]")]
    public class AnamnesisController : ControllerBase
    {
        private readonly AnamnesisService _anamnesisService;

        public AnamnesisController(AnamnesisService anamnesisService)
        {
            _anamnesisService = anamnesisService;
        }

        [HttpGet("paciente/{pacienteId}")]
        public async Task<IActionResult> GetAnamnesisByPacienteId(int pacienteId)
        {
            try
            {
                var anamnesis = await _anamnesisService.GetAnamnesisByPacienteIdAsync(pacienteId);

                if (anamnesis == null)
                {
                    // Considerar si devolver 404 Not Found o 200 OK con cuerpo vacío si no hay anamnesis (depende de la lógica del frontend)
                    // Devolver 404 si la anamnesis para ese paciente no existe es razonable.
                     return NotFound($"No se encontró anamnesis para el paciente con ID {pacienteId}");
                }

                return Ok(anamnesis);
            }
            catch (Exception ex)
            {
                // Log error
                return StatusCode(500, "Error interno del servidor: " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAnamnesis([FromBody] AnamnesisRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdAnamnesis = await _anamnesisService.CreateAnamnesisAsync(request);
                // Devolver 201 Created con la ubicación del nuevo recurso si es posible
                return CreatedAtAction(nameof(GetAnamnesisByPacienteId), new { pacienteId = createdAnamnesis.PacienteId }, createdAnamnesis);
            }
             catch (InvalidOperationException ex) // Capturar excepciones específicas si se lanzan desde el servicio (ej: Paciente no encontrado)
            {
                 return BadRequest(ex.Message); // Devolver 400 Bad Request si hay un problema con la solicitud (ej: paciente inexistente)
            }
            catch (Exception ex)
            {
                // Log error
                return StatusCode(500, "Error interno del servidor: " + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAnamnesis(int id, [FromBody] AnamnesisRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedAnamnesis = await _anamnesisService.UpdateAnamnesisAsync(id, request);

                if (updatedAnamnesis == null)
                {
                    return NotFound($"Anamnesis con ID {id} no encontrada.");
                }

                return Ok(updatedAnamnesis);
            }
             catch (InvalidOperationException ex)
            {
                 return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                // Log error
                return StatusCode(500, "Error interno del servidor: " + ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnamnesis(int id)
        {
            try
            {
                var result = await _anamnesisService.DeleteAnamnesisAsync(id);

                if (!result)
                {
                    return NotFound($"Anamnesis con ID {id} no encontrada.");
                }

                return NoContent(); // 204 No Content para eliminación exitosa sin cuerpo de respuesta
            }
            catch (Exception ex)
            {
                // Log error
                return StatusCode(500, "Error interno del servidor: " + ex.Message);
            }
        }
    }
}