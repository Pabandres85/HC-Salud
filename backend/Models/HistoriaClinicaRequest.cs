using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class HistoriaClinicaRequest
    {
        [Required]
        public int PacienteId { get; set; }

        [Required]
        public DateTime FechaConsulta { get; set; }

        [Required]
        [StringLength(2000)]
        public string Subjetivo { get; set; }

        [Required]
        [StringLength(2000)]
        public string Objetivo { get; set; }

        [Required]
        [StringLength(2000)]
        public string Analisis { get; set; }

        [Required]
        [StringLength(2000)]
        public string Plan { get; set; }
    }
} 