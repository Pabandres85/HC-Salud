using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class CitaService
    {
        private readonly ApplicationDbContext _context;

        public CitaService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Método para crear una nueva cita
        public async Task<CitaResponse> CreateCitaAsync(CitaRequest request)
        {
            var pacienteExists = await _context.Pacientes.AnyAsync(p => p.Id == request.PacienteId);
            if (!pacienteExists)
            {
                throw new Exception($"Paciente con ID {request.PacienteId} no encontrado.");
            }

            var cita = new Cita
            {
                PacienteId = request.PacienteId,
                FechaHora = request.FechaHora.ToUniversalTime(), // Convertir a UTC
                Motivo = request.Motivo,
                Estado = request.Estado,
                CreadoEn = DateTime.UtcNow,
                ActualizadoEn = DateTime.UtcNow
            };

            _context.Citas.Add(cita);
            await _context.SaveChangesAsync();

            // Cargar el paciente para la respuesta
            await _context.Entry(cita).Reference(c => c.Paciente).LoadAsync();

            return new CitaResponse
            {
                Id = cita.Id,
                PacienteId = cita.PacienteId,
                PacienteNombreCompleto = cita.Paciente?.NombreCompleto,
                FechaHora = cita.FechaHora,
                Motivo = cita.Motivo,
                Estado = cita.Estado,
                CreadoEn = cita.CreadoEn,
                ActualizadoEn = cita.ActualizadoEn
            };
        }

        // Método para obtener una cita por ID
        public async Task<CitaResponse?> GetCitaByIdAsync(int id)
        {
            var cita = await _context.Citas
                .Include(c => c.Paciente)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cita == null)
            {
                return null;
            }

            return new CitaResponse
            {
                Id = cita.Id,
                PacienteId = cita.PacienteId,
                PacienteNombreCompleto = cita.Paciente?.NombreCompleto,
                FechaHora = cita.FechaHora,
                Motivo = cita.Motivo,
                Estado = cita.Estado,
                CreadoEn = cita.CreadoEn,
                ActualizadoEn = cita.ActualizadoEn
            };
        }

        // Método para obtener citas por paciente
        public async Task<IEnumerable<CitaResponse>> GetCitasByPacienteIdAsync(int pacienteId)
        {
             var pacienteExists = await _context.Pacientes.AnyAsync(p => p.Id == pacienteId);
            if (!pacienteExists)
            {
                throw new Exception($"Paciente con ID {pacienteId} no encontrado.");
            }

            var citas = await _context.Citas
                .Where(c => c.PacienteId == pacienteId)
                .OrderBy(c => c.FechaHora) // Ordenar por fecha y hora ascendente
                .Include(c => c.Paciente)
                .ToListAsync();

            return citas.Select(c => new CitaResponse
            {
                Id = c.Id,
                PacienteId = c.PacienteId,
                PacienteNombreCompleto = c.Paciente?.NombreCompleto,
                FechaHora = c.FechaHora,
                Motivo = c.Motivo,
                Estado = c.Estado,
                CreadoEn = c.CreadoEn,
                ActualizadoEn = c.ActualizadoEn
            });
        }

        // Método para obtener citas para una fecha específica (para el dashboard)
        public async Task<int> GetCitasForDateAsync(DateTime date)
        {
            // Normalizar la fecha para comparar solo el día
            var startOfDay = date.Date.ToUniversalTime();
            var endOfDay = startOfDay.AddDays(1);

            return await _context.Citas
                                 .CountAsync(c => c.FechaHora >= startOfDay && c.FechaHora < endOfDay);
        }

        // Método para actualizar una cita
        public async Task<CitaResponse?> UpdateCitaAsync(int id, CitaRequest request)
        {
            var cita = await _context.Citas.FindAsync(id);
            if (cita == null)
            {
                return null;
            }

            // Asegurarse de que la solicitud de actualización sea para la cita del paciente correcto si se incluye pacienteId
            if (request.PacienteId != 0 && cita.PacienteId != request.PacienteId)
            {
                 throw new Exception("El ID del paciente en la solicitud no coincide con la cita existente.");
            }

            cita.FechaHora = request.FechaHora.ToUniversalTime();
            cita.Motivo = request.Motivo;
            cita.Estado = request.Estado;
            cita.ActualizadoEn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

             // Cargar el paciente para la respuesta
            await _context.Entry(cita).Reference(c => c.Paciente).LoadAsync();

            return new CitaResponse
            {
                Id = cita.Id,
                PacienteId = cita.PacienteId,
                PacienteNombreCompleto = cita.Paciente?.NombreCompleto,
                FechaHora = cita.FechaHora,
                Motivo = cita.Motivo,
                Estado = cita.Estado,
                CreadoEn = cita.CreadoEn,
                ActualizadoEn = cita.ActualizadoEn
            };
        }

        // Método para eliminar una cita
        public async Task<bool> DeleteCitaAsync(int id)
        {
            var cita = await _context.Citas.FindAsync(id);
            if (cita == null)
            {
                return false;
            }

            _context.Citas.Remove(cita);
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 