using System;

namespace Backend.Models
{
    public class AnamnesisResponse
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public string? PacienteNombreCompleto { get; set; } // Para mostrar el nombre del paciente

        public string? GradoInstruccion { get; set; }
        public string? Religion { get; set; }
        public string? EstructuraFamiliar { get; set; }
        public string? Informante { get; set; }
        public string? Examinador { get; set; }
        public DateTime? FechaEntrevistaInicial { get; set; }
        public string? MotivoConsulta { get; set; }
        public string? ProblemaActual { get; set; }
        public string? ObservacionConducta { get; set; }
        public string? HistoriaFamiliarMadre { get; set; }
        public string? HistoriaFamiliarPadre { get; set; }

        public DateTime CreadoEn { get; set; }
        public DateTime ActualizadoEn { get; set; }
    }
}