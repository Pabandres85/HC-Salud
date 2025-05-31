using System;

namespace Backend.Models
{
    public class CitaResponse
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public string? PacienteNombreCompleto { get; set; } // Para mostrar el nombre del paciente en la respuesta
        public DateTime FechaHora { get; set; }
        public string? Motivo { get; set; }
        public string Estado { get; set; }
        public DateTime CreadoEn { get; set; }
        public DateTime ActualizadoEn { get; set; }
    }
} 