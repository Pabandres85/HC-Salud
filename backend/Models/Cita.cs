using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Cita
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PacienteId { get; set; }
        [ForeignKey("PacienteId")]
        public Paciente Paciente { get; set; } // Propiedad de navegación

        [Required]
        public DateTime FechaHora { get; set; }

        [StringLength(500)] // Opcional: limitar longitud del motivo
        public string? Motivo { get; set; }

        [Required]
        [StringLength(50)]
        public string Estado { get; set; } = "programada"; // Estado por defecto

        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
        public DateTime ActualizadoEn { get; set; } = DateTime.UtcNow;
    }
} 