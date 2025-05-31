using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class AnamnesisService
    {
        private readonly ApplicationDbContext _context;

        public AnamnesisService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AnamnesisResponse?> GetAnamnesisByPacienteIdAsync(int pacienteId)
        {
            var anamnesis = await _context.Anamnesis
                .Include(a => a.Paciente) // Incluir el paciente para obtener su nombre
                .FirstOrDefaultAsync(a => a.PacienteId == pacienteId);

            if (anamnesis == null)
            {
                return null;
            }

            return new AnamnesisResponse
            {
                Id = anamnesis.Id,
                PacienteId = anamnesis.PacienteId,
                PacienteNombreCompleto = anamnesis.Paciente?.NombreCompleto, // Usar null conditional operator
                GradoInstruccion = anamnesis.GradoInstruccion,
                Religion = anamnesis.Religion,
                EstructuraFamiliar = anamnesis.EstructuraFamiliar,
                Informante = anamnesis.Informante,
                Examinador = anamnesis.Examinador,
                FechaEntrevistaInicial = anamnesis.FechaEntrevistaInicial,
                MotivoConsulta = anamnesis.MotivoConsulta,
                ProblemaActual = anamnesis.ProblemaActual,
                ObservacionConducta = anamnesis.ObservacionConducta,
                HistoriaFamiliarMadre = anamnesis.HistoriaFamiliarMadre,
                HistoriaFamiliarPadre = anamnesis.HistoriaFamiliarPadre,
                CreadoEn = anamnesis.CreadoEn,
                ActualizadoEn = anamnesis.ActualizadoEn
            };
        }

        public async Task<AnamnesisResponse> CreateAnamnesisAsync(AnamnesisRequest request)
        {
            var pacienteExists = await _context.Pacientes.AnyAsync(p => p.Id == request.PacienteId);
            if (!pacienteExists)
            {
                throw new Exception($"Paciente con ID {request.PacienteId} no encontrado.");
            }

            var existingAnamnesis = await _context.Anamnesis.AnyAsync(a => a.PacienteId == request.PacienteId);
            if (existingAnamnesis)
            {
                 throw new Exception($"Ya existe una anamnesis para el paciente con ID {request.PacienteId}.");
            }


            var anamnesis = new Anamnesis
            {
                PacienteId = request.PacienteId,
                GradoInstruccion = request.GradoInstruccion,
                Religion = request.Religion,
                EstructuraFamiliar = request.EstructuraFamiliar,
                Informante = request.Informante,
                Examinador = request.Examinador,
                FechaEntrevistaInicial = request.FechaEntrevistaInicial?.ToUniversalTime(), // Convertir a UTC si no es nulo
                MotivoConsulta = request.MotivoConsulta,
                ProblemaActual = request.ProblemaActual,
                ObservacionConducta = request.ObservacionConducta,
                HistoriaFamiliarMadre = request.HistoriaFamiliarMadre,
                HistoriaFamiliarPadre = request.HistoriaFamiliarPadre,
                CreadoEn = DateTime.UtcNow,
                ActualizadoEn = DateTime.UtcNow
            };

            _context.Anamnesis.Add(anamnesis);
            await _context.SaveChangesAsync();

            // Opcional: Cargar el paciente para la respuesta si es necesario
             await _context.Entry(anamnesis).Reference(a => a.Paciente).LoadAsync();

             // Actualizar la fecha de última consulta en el paciente si la fecha de la anamnesis es más reciente
             var paciente = await _context.Pacientes.FindAsync(anamnesis.PacienteId);
             if (paciente != null)
             {
                 var fechaAnamnesis = anamnesis.FechaEntrevistaInicial ?? anamnesis.CreadoEn;
                 if (paciente.UltimaConsulta == null || fechaAnamnesis > paciente.UltimaConsulta)
                 {
                     paciente.UltimaConsulta = fechaAnamnesis;
                     await _context.SaveChangesAsync(); // Guardar el cambio en el paciente
                 }
             }

            return new AnamnesisResponse
            {
                Id = anamnesis.Id,
                PacienteId = anamnesis.PacienteId,
                PacienteNombreCompleto = anamnesis.Paciente?.NombreCompleto,
                GradoInstruccion = anamnesis.GradoInstruccion,
                Religion = anamnesis.Religion,
                EstructuraFamiliar = anamnesis.EstructuraFamiliar,
                Informante = anamnesis.Informante,
                Examinador = anamnesis.Examinador,
                FechaEntrevistaInicial = anamnesis.FechaEntrevistaInicial,
                MotivoConsulta = anamnesis.MotivoConsulta,
                ProblemaActual = anamnesis.ProblemaActual,
                ObservacionConducta = anamnesis.ObservacionConducta,
                HistoriaFamiliarMadre = anamnesis.HistoriaFamiliarMadre,
                HistoriaFamiliarPadre = anamnesis.HistoriaFamiliarPadre,
                CreadoEn = anamnesis.CreadoEn,
                ActualizadoEn = anamnesis.ActualizadoEn
            };
        }

        public async Task<AnamnesisResponse?> UpdateAnamnesisAsync(int id, AnamnesisRequest request)
        {
            var anamnesis = await _context.Anamnesis.FindAsync(id);
            if (anamnesis == null)
            {
                return null;
            }

             // Asegurarse de que la solicitud de actualización sea para la anamnesis del paciente correcto
            if (anamnesis.PacienteId != request.PacienteId)
            {
                 throw new Exception("El ID del paciente en la solicitud no coincide con la anamnesis existente.");
            }


            anamnesis.GradoInstruccion = request.GradoInstruccion;
            anamnesis.Religion = request.Religion;
            anamnesis.EstructuraFamiliar = request.EstructuraFamiliar;
            anamnesis.Informante = request.Informante;
            anamnesis.Examinador = request.Examinador;
            anamnesis.FechaEntrevistaInicial = request.FechaEntrevistaInicial?.ToUniversalTime();
            anamnesis.MotivoConsulta = request.MotivoConsulta;
            anamnesis.ProblemaActual = request.ProblemaActual;
            anamnesis.ObservacionConducta = request.ObservacionConducta;
            anamnesis.HistoriaFamiliarMadre = request.HistoriaFamiliarMadre;
            anamnesis.HistoriaFamiliarPadre = request.HistoriaFamiliarPadre;
            anamnesis.ActualizadoEn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

             // Opcional: Cargar el paciente para la respuesta si es necesario
             await _context.Entry(anamnesis).Reference(a => a.Paciente).LoadAsync();

             // Actualizar la fecha de última consulta en el paciente si la fecha de la anamnesis es más reciente
             var paciente = await _context.Pacientes.FindAsync(anamnesis.PacienteId);
             if (paciente != null)
             {
                 var fechaAnamnesis = anamnesis.FechaEntrevistaInicial ?? anamnesis.CreadoEn;
                 // Solo actualizamos si la fecha de esta anamnesis es posterior a la última registrada
                 if (paciente.UltimaConsulta == null || fechaAnamnesis > paciente.UltimaConsulta)
                 {
                     paciente.UltimaConsulta = fechaAnamnesis;
                     await _context.SaveChangesAsync(); // Guardar el cambio en el paciente
                 }
                 // Consideración: Si la fecha de la Anamnesis se actualiza a una fecha anterior, 
                 // y ya existen Notas de Progreso posteriores, el UltimaConsulta del paciente 
                 // debería reflejar la fecha de la Nota de Progreso más reciente. Esto añadiría complejidad.
                 // Por ahora, mantenemos la lógica simple de solo actualizar si la fecha de la Anamnesis es MÁS reciente.
             }

            return new AnamnesisResponse
            {
                Id = anamnesis.Id,
                PacienteId = anamnesis.PacienteId,
                 PacienteNombreCompleto = anamnesis.Paciente?.NombreCompleto,
                GradoInstruccion = anamnesis.GradoInstruccion,
                Religion = anamnesis.Religion,
                EstructuraFamiliar = anamnesis.EstructuraFamiliar,
                Informante = anamnesis.Informante,
                Examinador = anamnesis.Examinador,
                FechaEntrevistaInicial = anamnesis.FechaEntrevistaInicial,
                MotivoConsulta = anamnesis.MotivoConsulta,
                ProblemaActual = anamnesis.ProblemaActual,
                ObservacionConducta = anamnesis.ObservacionConducta,
                HistoriaFamiliarMadre = anamnesis.HistoriaFamiliarMadre,
                HistoriaFamiliarPadre = anamnesis.HistoriaFamiliarPadre,
                CreadoEn = anamnesis.CreadoEn,
                ActualizadoEn = anamnesis.ActualizadoEn
            };
        }

        public async Task<bool> DeleteAnamnesisAsync(int id)
        {
            var anamnesis = await _context.Anamnesis.FindAsync(id);
            if (anamnesis == null)
            {
                return false;
            }

            _context.Anamnesis.Remove(anamnesis);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}