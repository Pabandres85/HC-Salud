using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Anamnesis
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Paciente")]
        public int PacienteId { get; set; }

        // Propiedad de navegación para la relación con Paciente
        public Paciente? Paciente { get; set; } // Relación 1 a 1 o 1 a 0

        // Campos de Datos Generales Adicionales
        public string? GradoInstruccion { get; set; }
        public string? Religion { get; set; }
        public string? EstructuraFamiliar { get; set; }
        public string? Informante { get; set; }
        public string? Examinador { get; set; }
        public DateTime? FechaEntrevistaInicial { get; set; }

        // Secciones Principales de la Anamnesis
        [Required]
        public string MotivoConsulta { get; set; } = string.Empty;

        [Required]
        public string ProblemaActual { get; set; } = string.Empty;

        public string? ObservacionConducta { get; set; }

        // Historia Familiar
        public string? HistoriaFamiliarMadre { get; set; }
        public string? HistoriaFamiliarPadre { get; set; }

        // Timestamps
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
        public DateTime ActualizadoEn { get; set; } = DateTime.UtcNow;

        // Constructor para Entity Framework Core (opcional, pero recomendado)
        public Anamnesis() { }
    }
}