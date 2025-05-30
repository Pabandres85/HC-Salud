using System;

namespace Backend.Models
{
    public class HistoriaClinicaResponse
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public DateTime FechaConsulta { get; set; }
        public string Subjetivo { get; set; }
        public string Objetivo { get; set; }
        public string Analisis { get; set; }
        public string Plan { get; set; }
        public DateTime CreadoEn { get; set; }
        public DateTime ActualizadoEn { get; set; }
    }

    public class HistoriasClinicasResponse
    {
        public IEnumerable<HistoriaClinicaResponse> Data { get; set; }
        public int Total { get; set; }
        public int Pagina { get; set; }
        public int ItemsPorPagina { get; set; }
    }
} 