using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Paciente
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string NombreCompleto { get; set; } = string.Empty;

    [Required]
    public DateTime FechaNacimiento { get; set; }

    [Required]
    [StringLength(20)]
    public string Genero { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Direccion { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string Telefono { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Correo { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Ocupacion { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string EstadoCivil { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string Estado { get; set; } = "activo";

    public DateTime? UltimaConsulta { get; set; }

    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
} 