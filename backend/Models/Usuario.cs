using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Usuario
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string NombreCompleto { get; set; } = string.Empty;

    [Required]
    public string Correo { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public string Rol { get; set; } = "psicologo";

    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
}
