using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Paciente> Pacientes { get; set; }
    public DbSet<HistoriaClinica> HistoriasClinicas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurar Entity Framework para mapear la entidad Usuario a la tabla 'usuarios' y sus columnas
        modelBuilder.Entity<Usuario>()
            .ToTable("usuarios")
            .Property(u => u.Id).HasColumnName("id"); // Mapear explícitamente Id a columna 'id'

        modelBuilder.Entity<Usuario>()
            .Property(u => u.NombreCompleto).HasColumnName("nombrecompleto");

        modelBuilder.Entity<Usuario>()
            .Property(u => u.Correo).HasColumnName("correo");

        modelBuilder.Entity<Usuario>()
            .Property(u => u.PasswordHash).HasColumnName("passwordhash");

        modelBuilder.Entity<Usuario>()
            .Property(u => u.Rol).HasColumnName("rol");
            
        modelBuilder.Entity<Usuario>()
            .Property(u => u.CreadoEn).HasColumnName("creadoen");

        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Correo)
            .IsUnique();

        // Configurar Entity Framework para mapear la entidad Paciente a la tabla 'pacientes' y sus columnas
         modelBuilder.Entity<Paciente>()
            .ToTable("pacientes")
            .Property(p => p.Id).HasColumnName("id"); // Mapear explícitamente Id a columna 'id'

        modelBuilder.Entity<Paciente>()
            .Property(p => p.NombreCompleto).HasColumnName("nombrecompleto");

        modelBuilder.Entity<Paciente>()
            .Property(p => p.FechaNacimiento).HasColumnName("fechanacimiento");

        modelBuilder.Entity<Paciente>()
            .Property(p => p.Genero).HasColumnName("genero");
            
        modelBuilder.Entity<Paciente>()
            .Property(p => p.Direccion).HasColumnName("direccion");

        modelBuilder.Entity<Paciente>()
            .Property(p => p.Telefono).HasColumnName("telefono");

        modelBuilder.Entity<Paciente>()
            .Property(p => p.Correo).HasColumnName("correo");
            
        modelBuilder.Entity<Paciente>()
            .Property(p => p.Ocupacion).HasColumnName("ocupacion");
            
        modelBuilder.Entity<Paciente>()
            .Property(p => p.EstadoCivil).HasColumnName("estadocivil");

        modelBuilder.Entity<Paciente>()
            .Property(p => p.Estado).HasColumnName("estado");

        modelBuilder.Entity<Paciente>()
            .Property(p => p.UltimaConsulta).HasColumnName("ultimaconsulta");

        modelBuilder.Entity<Paciente>()
            .Property(p => p.CreadoEn).HasColumnName("creadoen");

        modelBuilder.Entity<Paciente>()
            .HasIndex(p => p.Correo)
            .IsUnique();

        // Configurar Entity Framework para mapear la entidad HistoriaClinica a la tabla 'historiasclinicas' y sus columnas
        modelBuilder.Entity<HistoriaClinica>()
            .ToTable("historiasclinicas")
            .Property(h => h.Id).HasColumnName("id");

        modelBuilder.Entity<HistoriaClinica>()
            .Property(h => h.PacienteId).HasColumnName("pacienteid");

        modelBuilder.Entity<HistoriaClinica>()
            .Property(h => h.FechaConsulta).HasColumnName("fechaconsulta");

        modelBuilder.Entity<HistoriaClinica>()
            .Property(h => h.Subjetivo).HasColumnName("subjetivo");

        modelBuilder.Entity<HistoriaClinica>()
            .Property(h => h.Objetivo).HasColumnName("objetivo");

        modelBuilder.Entity<HistoriaClinica>()
            .Property(h => h.Analisis).HasColumnName("analisis");

        modelBuilder.Entity<HistoriaClinica>()
            .Property(h => h.Plan).HasColumnName("plan");

        modelBuilder.Entity<HistoriaClinica>()
            .Property(h => h.CreadoEn).HasColumnName("creadoen");

        modelBuilder.Entity<HistoriaClinica>()
            .Property(h => h.ActualizadoEn).HasColumnName("actualizadoen");

        // Configurar la relación entre HistoriaClinica y Paciente
        modelBuilder.Entity<HistoriaClinica>()
            .HasOne(h => h.Paciente)
            .WithMany()
            .HasForeignKey(h => h.PacienteId);
    }
}
