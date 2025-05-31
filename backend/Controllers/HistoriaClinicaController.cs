using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

// QuestPDF using directives
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

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
            Console.WriteLine($"🔍 INICIO: Generando PDF para paciente {pacienteId}");
            
            // Obtener historias clínicas
            var historiasResponse = await _historiaClinicaService.GetHistoriasClinicasByPaciente(pacienteId, 1, 100);
            Console.WriteLine($"🔍 DATOS: Historias obtenidas - {historiasResponse?.Data?.Count() ?? 0}");
            
            if (historiasResponse?.Data == null || !historiasResponse.Data.Any())
            {
                Console.WriteLine("❌ No se encontraron historias clínicas");
                return NotFound(new { message = "No se encontraron historias clínicas para este paciente." });
            }

            var historias = historiasResponse.Data.ToList();
            Console.WriteLine($"🔍 LISTA: {historias.Count} historias procesadas");

            // Obtener anamnesis
            AnamnesisResponse? anamnesis = null;
            try
            {
                anamnesis = await _anamnesisService.GetAnamnesisByPacienteIdAsync(pacienteId);
                Console.WriteLine($"🔍 ANAMNESIS: Obtenida exitosamente");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ No se pudo obtener anamnesis: {ex.Message}");
                // Continuar sin anamnesis
            }

            var pacienteNombre = $"Paciente {pacienteId}"; // Simplificado por ahora

            Console.WriteLine("🔍 PDF: Iniciando creación de documento QuestPDF...");
            
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(40);

                    // HEADER
                    page.Header().Column(column =>
                    {
                        column.Item().Text("HISTORIA CLÍNICA INTEGRAL")
                            .FontSize(18)
                            .Bold()
                            .AlignCenter();
                        
                        column.Item().Text($"Paciente: {pacienteNombre}")
                            .FontSize(14)
                            .Bold()
                            .AlignCenter();
                            
                        column.Item().Text($"Fecha de generación: {DateTime.Now:dd/MM/yyyy HH:mm}")
                            .FontSize(10)
                            .AlignCenter();
                            
                        column.Item().LineHorizontal(1);
                    });

                    page.Content().Column(column =>
                    {
                        // Espaciado inicial
                        column.Item().Container().Height(20);

                        // INFORMACIÓN DE ANAMNESIS (si existe)
                        if (anamnesis != null)
                        {
                            column.Item().Text("ANAMNESIS INICIAL")
                                .FontSize(16)
                                .Bold();

                            column.Item().Container().Height(10);

                            column.Item().Row(row =>
                            {
                                row.RelativeItem().Column(col =>
                                {
                                    col.Item().Text($"Grado de Instrucción: {anamnesis.GradoInstruccion ?? "N/A"}").FontSize(10);
                                    col.Item().Text($"Religión: {anamnesis.Religion ?? "N/A"}").FontSize(10);
                                    col.Item().Text($"Estructura Familiar: {anamnesis.EstructuraFamiliar ?? "N/A"}").FontSize(10);
                                    col.Item().Text($"Informante: {anamnesis.Informante ?? "N/A"}").FontSize(10);
                                });
                                
                                row.RelativeItem().Column(col =>
                                {
                                    col.Item().Text($"Examinador: {anamnesis.Examinador ?? "N/A"}").FontSize(10);
                                    col.Item().Text($"Fecha Entrevista: {anamnesis.FechaEntrevistaInicial:dd/MM/yyyy}").FontSize(10);
                                    col.Item().Text($"Motivo de Consulta: {anamnesis.MotivoConsulta ?? "N/A"}").FontSize(10);
                                });
                            });

                            column.Item().Text($"Problema Actual: {anamnesis.ProblemaActual ?? "N/A"}")
                                .FontSize(10);
                                
                            column.Item().Text($"Observación de Conducta: {anamnesis.ObservacionConducta ?? "N/A"}")
                                .FontSize(10);

                            column.Item().Container().Height(10);
                            column.Item().LineHorizontal(0.5f);
                            column.Item().Container().Height(15);
                        }

                        // NOTAS DE PROGRESO
                        column.Item().Text("NOTAS DE PROGRESO (SESIONES)")
                            .FontSize(16)
                            .Bold();

                        column.Item().Container().Height(10);

                        var contador = 1;
                        foreach (var historia in historias)
                        {
                            // Encabezado de sesión
                            column.Item().Row(row =>
                            {
                                row.RelativeItem().Text($"SESIÓN {contador}")
                                    .FontSize(12)
                                    .Bold();
                                row.RelativeItem().Text($"Fecha: {historia.FechaConsulta:dd/MM/yyyy HH:mm}")
                                    .FontSize(12)
                                    .Bold()
                                    .AlignRight();
                            });

                            column.Item().Container().Height(5);

                            // Contenido SOAP
                            column.Item().Column(soapColumn =>
                            {
                                soapColumn.Item().Text("SUBJETIVO:")
                                    .FontSize(11)
                                    .Bold();
                                soapColumn.Item().Text(historia.Subjetivo ?? "N/A")
                                    .FontSize(10);

                                soapColumn.Item().Container().Height(3);

                                soapColumn.Item().Text("OBJETIVO:")
                                    .FontSize(11)
                                    .Bold();
                                soapColumn.Item().Text(historia.Objetivo ?? "N/A")
                                    .FontSize(10);

                                soapColumn.Item().Container().Height(3);

                                soapColumn.Item().Text("ANÁLISIS:")
                                    .FontSize(11)
                                    .Bold();
                                soapColumn.Item().Text(historia.Analisis ?? "N/A")
                                    .FontSize(10);

                                soapColumn.Item().Container().Height(3);

                                soapColumn.Item().Text("PLAN:")
                                    .FontSize(11)
                                    .Bold();
                                soapColumn.Item().Text(historia.Plan ?? "N/A")
                                    .FontSize(10);
                            });

                            // Separador entre sesiones
                            if (contador < historias.Count)
                            {
                                column.Item().Container().Height(10);
                                column.Item().LineHorizontal(0.5f);
                                column.Item().Container().Height(10);
                            }

                            contador++;
                        }
                    });

                    // FOOTER
                    page.Footer().Row(row =>
                    {
                        row.RelativeItem().Text("Generado automáticamente por Sistema de Psicología")
                            .FontSize(8);
                        row.RelativeItem().Text("Página {{pdf.PageNumber}} de {{pdf.TotalPages}}")
                            .FontSize(8)
                            .AlignRight();
                    });
                });
            });

            Console.WriteLine("🔍 PDF: Generando bytes...");
            var pdfBytes = document.GeneratePdf();
            Console.WriteLine($"✅ PDF: Generado exitosamente - {pdfBytes.Length} bytes");
            
            return File(pdfBytes, "application/pdf", $"HistoriaClinica_Paciente_{pacienteId}_{DateTime.Now:yyyyMMdd}.pdf");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"💥 ERROR COMPLETO: {ex.Message}");
            Console.WriteLine($"💥 TIPO: {ex.GetType().Name}");
            Console.WriteLine($"💥 STACK: {ex.StackTrace}");
            return StatusCode(500, new { 
                message = "Error al generar PDF", 
                error = ex.Message,
                type = ex.GetType().Name
            });
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