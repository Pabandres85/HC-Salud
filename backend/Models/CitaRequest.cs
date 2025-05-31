using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class CitaRequest
    {
        [Required]
        public int PacienteId { get; set; }

        [Required]
        public DateTime FechaHora { get; set; }

        [StringLength(500)]
        public string? Motivo { get; set; }

        [Required]
        [StringLength(50)]
        public string Estado { get; set; }
    }
} 