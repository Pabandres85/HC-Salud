using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class HistoriaClinica
    {
        [Key]
        public int Id { get; set; }

        // Clave foránea para el paciente
        public int PacienteId { get; set; }
        [ForeignKey("PacienteId")]
        public Paciente Paciente { get; set; } // Propiedad de navegación

        // Clave foránea para el usuario (psicólogo)
        // public int UsuarioId { get; set; }
        // [ForeignKey("UsuarioId")]
        // public Usuario Usuario { get; set; } // Propiedad de navegación (necesitaríamos un modelo Usuario)

        public DateTime FechaConsulta { get; set; }

        [MaxLength(2000)] // Ejemplo de límite de longitud
        public string Subjetivo { get; set; } // Notas del paciente

        [MaxLength(2000)]
        public string Objetivo { get; set; } // Observaciones del terapeuta

        [MaxLength(2000)]
        public string Analisis { get; set; } // Análisis y diagnóstico

        [MaxLength(2000)]
        public string Plan { get; set; } // Plan de tratamiento

        public DateTime CreadoEn { get; set; }
        public DateTime ActualizadoEn { get; set; }
    }
} 