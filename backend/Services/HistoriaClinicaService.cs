using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services;

public class HistoriaClinicaService
{
    private readonly ApplicationDbContext _context;

    public HistoriaClinicaService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<HistoriaClinicaResponse?> GetHistoriaClinica(int id)
    {
        // TODO: Implementar lógica para obtener una historia clínica por ID
        var historia = await _context.HistoriasClinicas
            .Include(h => h.Paciente)
            .FirstOrDefaultAsync(h => h.Id == id);

        if (historia == null)
        {
            return null;
        }

        return new HistoriaClinicaResponse
        {
            Id = historia.Id,
            PacienteId = historia.PacienteId,
            FechaConsulta = historia.FechaConsulta,
            Subjetivo = historia.Subjetivo,
            Objetivo = historia.Objetivo,
            Analisis = historia.Analisis,
            Plan = historia.Plan,
            CreadoEn = historia.CreadoEn,
            ActualizadoEn = historia.ActualizadoEn
        };
    }

    public async Task<HistoriasClinicasResponse> GetHistoriasClinicasByPaciente(int pacienteId, int pagina, int itemsPorPagina)
    {
        // TODO: Implementar lógica para obtener historias clínicas por paciente con paginación
         var query = _context.HistoriasClinicas
            .Where(h => h.PacienteId == pacienteId)
            .OrderByDescending(h => h.FechaConsulta) // Ordenar por fecha descendente
            .AsQueryable();

        var total = await query.CountAsync();

        var historias = await query
            .Skip((pagina - 1) * itemsPorPagina)
            .Take(itemsPorPagina)
            .Select(h => new HistoriaClinicaResponse
            {
                Id = h.Id,
                PacienteId = h.PacienteId,
                FechaConsulta = h.FechaConsulta,
                Subjetivo = h.Subjetivo,
                Objetivo = h.Objetivo,
                Analisis = h.Analisis,
                Plan = h.Plan,
                CreadoEn = h.CreadoEn,
                ActualizadoEn = h.ActualizadoEn
            })
            .ToListAsync();

         return new HistoriasClinicasResponse // Placeholder
        {
            Data = historias,
            Total = total,
            Pagina = pagina,
            ItemsPorPagina = itemsPorPagina
        };
    }

    public async Task<HistoriaClinicaResponse> CrearHistoriaClinica(HistoriaClinicaRequest request)
    {
        // TODO: Implementar lógica para crear una nueva historia clínica
         var historia = new HistoriaClinica
        {
            PacienteId = request.PacienteId,
            FechaConsulta = request.FechaConsulta.ToUniversalTime(), // Convertir a UTC
            Subjetivo = request.Subjetivo,
            Objetivo = request.Objetivo,
            Analisis = request.Analisis,
            Plan = request.Plan,
            CreadoEn = DateTime.UtcNow,
            ActualizadoEn = DateTime.UtcNow
        };

        _context.HistoriasClinicas.Add(historia);
        await _context.SaveChangesAsync();

         return new HistoriaClinicaResponse // Placeholder
        {
            Id = historia.Id,
            PacienteId = historia.PacienteId,
            FechaConsulta = historia.FechaConsulta,
            Subjetivo = historia.Subjetivo,
            Objetivo = historia.Objetivo,
            Analisis = historia.Analisis,
            Plan = historia.Plan,
            CreadoEn = historia.CreadoEn,
            ActualizadoEn = historia.ActualizadoEn
        };
    }

    public async Task<HistoriaClinicaResponse?> ActualizarHistoriaClinica(int id, HistoriaClinicaRequest request)
    {
        // TODO: Implementar lógica para actualizar una historia clínica
        var historia = await _context.HistoriasClinicas.FindAsync(id);

        if (historia == null)
        {
            return null;
        }

        historia.FechaConsulta = request.FechaConsulta.ToUniversalTime(); // Convertir a UTC
        historia.Subjetivo = request.Subjetivo;
        historia.Objetivo = request.Objetivo;
        historia.Analisis = request.Analisis;
        historia.Plan = request.Plan;
        historia.ActualizadoEn = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new HistoriaClinicaResponse
        {
            Id = historia.Id,
            PacienteId = historia.PacienteId,
            FechaConsulta = historia.FechaConsulta,
            Subjetivo = historia.Subjetivo,
            Objetivo = historia.Objetivo,
            Analisis = historia.Analisis,
            Plan = historia.Plan,
            CreadoEn = historia.CreadoEn,
            ActualizadoEn = historia.ActualizadoEn
        };
    }

    public async Task<bool> EliminarHistoriaClinica(int id)
    {
        // TODO: Implementar lógica para eliminar una historia clínica
        var historia = await _context.HistoriasClinicas.FindAsync(id);

        if (historia == null)
        {
            return false;
        }

        _context.HistoriasClinicas.Remove(historia);
        await _context.SaveChangesAsync();

        return true;
    }
} 