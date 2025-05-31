using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Backend.Models; // Ajusta el namespace si es diferente
using Backend.Services; // Ajusta el namespace si es diferente
using System.Linq;
using System;

namespace Backend.Controllers // Asegúrate de usar el namespace correcto de tus controladores
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly PacienteService _pacienteService;
        private readonly HistoriaClinicaService _historiaClinicaService;
        private readonly CitaService _citaService;

        public DashboardController(PacienteService pacienteService, HistoriaClinicaService historiaClinicaService, CitaService citaService)
        {
            _pacienteService = pacienteService;
            _historiaClinicaService = historiaClinicaService;
            _citaService = citaService;
        }

        [HttpGet("RecentActivity")]
        public async Task<IActionResult> GetRecentActivity()
        {
            int numberOfItems = 10; // Número de elementos recientes a mostrar
            // var recentPatients = new List<Paciente>(); // Reemplazar con llamada al servicio
            // var recentHistorias = new List<HistoriaClinica>(); // Reemplazar con llamada al servicio

            try
            {
                // Usar los nuevos métodos eficientes para obtener los últimos elementos
                var recentPatients = await _pacienteService.GetLatestPacientesAsync(numberOfItems);
                var recentHistorias = await _historiaClinicaService.GetLatestHistoriasClinicasAsync(numberOfItems);

                // Combinar y formatear la actividad usando la nueva clase RecentActivityItem
                var combinedActivity = new List<RecentActivityItem>(); // Usar la clase modelo

                combinedActivity.AddRange(recentPatients.Select(p => new RecentActivityItem // Usar la clase modelo
                {
                    Type = "Nuevo Paciente",
                    Description = $"Nuevo paciente registrado: {p.NombreCompleto}", // Corregido: NombreCompleto
                    Date = p.CreadoEn // Usar la propiedad de fecha de creación del Paciente
                }));

                combinedActivity.AddRange(recentHistorias.Select(h => new RecentActivityItem // Usar la clase modelo
                {
                    Type = "Historia Clínica",
                    // Usar h.Paciente.NombreCompleto para obtener el nombre del paciente asociado
                    Description = $"Historia clínica actualizada para: {h.Paciente?.NombreCompleto ?? "[Paciente Desconocido]"}", // Usar null conditional operator por seguridad
                    Date = h.CreadoEn // Usar la propiedad de fecha de creación o actualización de HistoriaClinica
                }));

                // Ordenar por fecha descendente y limitar el resultado final
                var finalRecentActivity = combinedActivity.OrderByDescending(a => a.Date).Take(numberOfItems).ToList(); // Ahora a.Date es reconocido

                return Ok(finalRecentActivity);
            }
            catch (System.Exception ex)
            {
                 // Log error
                 return StatusCode(500, "Error al obtener actividad reciente: " + ex.Message);
            }
        }

        // Aquí podrías añadir otros endpoints para datos del dashboard, como contadores específicos o datos para gráficas.
        // Por ejemplo, para obtener los contadores de pacientes, consultas del mes, etc.:
        
        [HttpGet("Counts")]
        public async Task<IActionResult> GetDashboardCounts()
        {
            // TODO: Implementar métodos en tus servicios para obtener estos contadores de forma eficiente.
            // Por ejemplo:
            // Task<int> GetTotalPacientesAsync();
            // Task<int> GetConsultasThisMonthAsync();
            // Task<int> GetCitasTodayAsync(); // Si tienes un servicio/entidad para citas

            try
            {
                // Usar los métodos eficientes para obtener los contadores
                var totalPacientes = await _pacienteService.GetTotalPacientesAsync();
                var consultasEsteMes = await _historiaClinicaService.GetConsultasThisMonthAsync();
                
                // Log temporal para depuración
                Console.WriteLine($"[DashboardController] ConsultasEsteMes obtenido: {consultasEsteMes}");
                
                // TODO: Implementar la lógica para obtener las citas programadas para hoy.
                // Esto requiere una entidad/tabla de Citas y un método en un servicio correspondiente.
                var citasHoy = await _citaService.GetCitasForDateAsync(DateTime.Now);

                return Ok(new { totalPacientes, consultasEsteMes, citasHoy });
            }
            catch (System.Exception ex)
            {
                // Log error
                return StatusCode(500, "Error al obtener contadores del dashboard: " + ex.Message);
            }
        }
        
    }
} 