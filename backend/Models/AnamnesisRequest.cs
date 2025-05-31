using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class AnamnesisRequest
    {
        [Required]
        public int PacienteId { get; set; }

        [StringLength(100)]
        public string? GradoInstruccion { get; set; }

        [StringLength(100)]
        public string? Religion { get; set; }

        public string? EstructuraFamiliar { get; set; }

        [StringLength(100)]
        public string? Informante { get; set; }

        [StringLength(100)]
        public string? Examinador { get; set; }

        public DateTime? FechaEntrevistaInicial { get; set; }

        [Required] // Consideramos que el motivo de consulta es requerido para la anamnesis inicial
        public string MotivoConsulta { get; set; }

        [Required] // Consideramos que el problema actual es requerido
        public string ProblemaActual { get; set; }

        public string? ObservacionConducta { get; set; }

        public string? HistoriaFamiliarMadre { get; set; }
        public string? HistoriaFamiliarPadre { get; set; }
    }
}