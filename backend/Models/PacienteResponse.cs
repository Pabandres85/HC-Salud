namespace Backend.Models;

public class PacienteResponse
{
    public int Id { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public DateTime FechaNacimiento { get; set; }
    public string Genero { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Ocupacion { get; set; } = string.Empty;
    public string EstadoCivil { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public DateTime? UltimaConsulta { get; set; }
    public DateTime CreadoEn { get; set; }
}

public class PacientesResponse
{
    public List<PacienteResponse> Data { get; set; } = new();
    public int Total { get; set; }
    public int Pagina { get; set; }
    public int ItemsPorPagina { get; set; }
} 