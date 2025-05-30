using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class PacienteService
{
    private readonly ApplicationDbContext _context;

    public PacienteService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PacientesResponse> GetPacientes(int pagina, int itemsPorPagina)
    {
        var query = _context.Pacientes.AsQueryable();
        var total = await query.CountAsync();

        var pacientes = await query
            .Skip((pagina - 1) * itemsPorPagina)
            .Take(itemsPorPagina)
            .Select(p => new PacienteResponse
            {
                Id = p.Id,
                NombreCompleto = p.NombreCompleto,
                FechaNacimiento = p.FechaNacimiento,
                Genero = p.Genero,
                Direccion = p.Direccion,
                Telefono = p.Telefono,
                Correo = p.Correo,
                Ocupacion = p.Ocupacion,
                EstadoCivil = p.EstadoCivil,
                Estado = p.Estado,
                UltimaConsulta = p.UltimaConsulta,
                CreadoEn = p.CreadoEn
            })
            .ToListAsync();

        return new PacientesResponse
        {
            Data = pacientes,
            Total = total,
            Pagina = pagina,
            ItemsPorPagina = itemsPorPagina
        };
    }

    public async Task<PacienteResponse?> GetPaciente(int id)
    {
        var paciente = await _context.Pacientes.FindAsync(id);
        if (paciente == null)
            return null;

        return new PacienteResponse
        {
            Id = paciente.Id,
            NombreCompleto = paciente.NombreCompleto,
            FechaNacimiento = paciente.FechaNacimiento,
            Genero = paciente.Genero,
            Direccion = paciente.Direccion,
            Telefono = paciente.Telefono,
            Correo = paciente.Correo,
            Ocupacion = paciente.Ocupacion,
            EstadoCivil = paciente.EstadoCivil,
            Estado = paciente.Estado,
            UltimaConsulta = paciente.UltimaConsulta,
            CreadoEn = paciente.CreadoEn
        };
    }

    public async Task<PacienteResponse> CrearPaciente(PacienteRequest request)
    {
        var paciente = new Paciente
        {
            NombreCompleto = request.NombreCompleto,
            FechaNacimiento = request.FechaNacimiento.ToUniversalTime(),
            Genero = request.Genero,
            Direccion = request.Direccion,
            Telefono = request.Telefono,
            Correo = request.Correo,
            Ocupacion = request.Ocupacion,
            EstadoCivil = request.EstadoCivil,
            Estado = "activo",
            CreadoEn = DateTime.UtcNow
        };

        _context.Pacientes.Add(paciente);
        await _context.SaveChangesAsync();

        return new PacienteResponse
        {
            Id = paciente.Id,
            NombreCompleto = paciente.NombreCompleto,
            FechaNacimiento = paciente.FechaNacimiento,
            Genero = paciente.Genero,
            Direccion = paciente.Direccion,
            Telefono = paciente.Telefono,
            Correo = paciente.Correo,
            Ocupacion = paciente.Ocupacion,
            EstadoCivil = paciente.EstadoCivil,
            Estado = paciente.Estado,
            UltimaConsulta = paciente.UltimaConsulta,
            CreadoEn = paciente.CreadoEn
        };
    }

    public async Task<PacienteResponse?> ActualizarPaciente(int id, PacienteRequest request)
    {
        var paciente = await _context.Pacientes.FindAsync(id);
        if (paciente == null)
            return null;

        paciente.NombreCompleto = request.NombreCompleto;
        paciente.FechaNacimiento = request.FechaNacimiento.ToUniversalTime();
        paciente.Genero = request.Genero;
        paciente.Direccion = request.Direccion;
        paciente.Telefono = request.Telefono;
        paciente.Correo = request.Correo;
        paciente.Ocupacion = request.Ocupacion;
        paciente.EstadoCivil = request.EstadoCivil;

        await _context.SaveChangesAsync();

        return new PacienteResponse
        {
            Id = paciente.Id,
            NombreCompleto = paciente.NombreCompleto,
            FechaNacimiento = paciente.FechaNacimiento,
            Genero = paciente.Genero,
            Direccion = paciente.Direccion,
            Telefono = paciente.Telefono,
            Correo = paciente.Correo,
            Ocupacion = paciente.Ocupacion,
            EstadoCivil = paciente.EstadoCivil,
            Estado = paciente.Estado,
            UltimaConsulta = paciente.UltimaConsulta,
            CreadoEn = paciente.CreadoEn
        };
    }

    public async Task<bool> EliminarPaciente(int id)
    {
        var paciente = await _context.Pacientes.FindAsync(id);
        if (paciente == null)
            return false;

        _context.Pacientes.Remove(paciente);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<PacienteResponse?> CambiarEstado(int id)
    {
        var paciente = await _context.Pacientes.FindAsync(id);
        if (paciente == null)
            return null;

        paciente.Estado = paciente.Estado == "activo" ? "inactivo" : "activo";
        await _context.SaveChangesAsync();

        return new PacienteResponse
        {
            Id = paciente.Id,
            NombreCompleto = paciente.NombreCompleto,
            FechaNacimiento = paciente.FechaNacimiento,
            Genero = paciente.Genero,
            Direccion = paciente.Direccion,
            Telefono = paciente.Telefono,
            Correo = paciente.Correo,
            Ocupacion = paciente.Ocupacion,
            EstadoCivil = paciente.EstadoCivil,
            Estado = paciente.Estado,
            UltimaConsulta = paciente.UltimaConsulta,
            CreadoEn = paciente.CreadoEn
        };
    }
} 