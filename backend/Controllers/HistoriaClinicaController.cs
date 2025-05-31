using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

// QuestPDF using directives
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Drawing;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HistoriaClinicaController : ControllerBase
{
    private readonly HistoriaClinicaService _historiaClinicaService;
    private readonly AnamnesisService _anamnesisService;

    public HistoriaClinicaController(HistoriaClinicaService historiaClinicaService, AnamnesisService anamnesisService)
    {
        _historiaClinicaService = historiaClinicaService;
        _anamnesisService = anamnesisService;
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

    // GET: api/HistoriaClinica/paciente/{pacienteId}/pdf
    [HttpGet("paciente/{pacienteId}/pdf")]
    public async Task<IActionResult> DownloadHistoriaClinicaPdf(int pacienteId)
    {
        try
        {
            // Obtener historias clínicas del paciente
            var historiasResponse = await _historiaClinicaService.GetHistoriasClinicasByPaciente(pacienteId, 1, 100);
            
            // Verificar que tenemos datos - CORREGIDO
            if (historiasResponse?.Data == null || !historiasResponse.Data.Any())
            {
                return NotFound(new { message = "No se encontraron historias clínicas para este paciente." });
            }

            // Convertir a lista para poder trabajar con ella - CORREGIDO
            var historias = historiasResponse.Data.ToList();

            // Crear documento PDF
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(40);

                    page.Header()
                        .Text($"Historia Clínica - Paciente {pacienteId}")
                        .FontSize(16)
                        .Bold()
                        .AlignCenter();

                    page.Content()
                        .PaddingVertical(10)
                        .Column(column =>
                        {
                            column.Item().Text("Notas de Progreso").FontSize(14).Bold();
                            column.Item().Text("").LineHeight(0.5f);
                            
                            // Usar foreach en lugar de for loop - CORREGIDO
                            var contador = 1;
                            foreach (var historia in historias)
                            {
                                column.Item().Text($"{contador}. Fecha: {historia.FechaConsulta:dd/MM/yyyy HH:mm}").Bold();
                                column.Item().Text($"Subjetivo: {historia.Subjetivo}");
                                column.Item().Text($"Objetivo: {historia.Objetivo}");
                                column.Item().Text($"Análisis: {historia.Analisis}");
                                column.Item().Text($"Plan: {historia.Plan}");
                                column.Item().Text("").LineHeight(0.5f);
                                contador++;
                            }
                        });

                    page.Footer()
                        .Text("Generado automáticamente")
                        .FontSize(10)
                        .AlignCenter();
                });
            });

            // Generar PDF
            var pdfBytes = document.GeneratePdf();
            
            // Retornar archivo
            return File(pdfBytes, "application/pdf", $"HistoriaClinica_Paciente_{pacienteId}.pdf");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al generar PDF", error = ex.Message });
        }
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
        return NoContent();
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