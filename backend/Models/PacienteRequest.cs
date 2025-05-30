using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class PacienteRequest
{
    [Required(ErrorMessage = "El nombre completo es requerido")]
    [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres")]
    public string NombreCompleto { get; set; } = string.Empty;

    [Required(ErrorMessage = "La fecha de nacimiento es requerida")]
    public DateTime FechaNacimiento { get; set; }

    [Required(ErrorMessage = "El género es requerido")]
    [StringLength(20, ErrorMessage = "El género no puede exceder los 20 caracteres")]
    public string Genero { get; set; } = string.Empty;

    [Required(ErrorMessage = "La dirección es requerida")]
    [StringLength(200, ErrorMessage = "La dirección no puede exceder los 200 caracteres")]
    public string Direccion { get; set; } = string.Empty;

    [Required(ErrorMessage = "El teléfono es requerido")]
    [StringLength(20, ErrorMessage = "El teléfono no puede exceder los 20 caracteres")]
    public string Telefono { get; set; } = string.Empty;

    [Required(ErrorMessage = "El correo electrónico es requerido")]
    [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido")]
    [StringLength(100, ErrorMessage = "El correo no puede exceder los 100 caracteres")]
    public string Correo { get; set; } = string.Empty;

    [Required(ErrorMessage = "La ocupación es requerida")]
    [StringLength(100, ErrorMessage = "La ocupación no puede exceder los 100 caracteres")]
    public string Ocupacion { get; set; } = string.Empty;

    [Required(ErrorMessage = "El estado civil es requerido")]
    [StringLength(50, ErrorMessage = "El estado civil no puede exceder los 50 caracteres")]
    public string EstadoCivil { get; set; } = string.Empty;
} 