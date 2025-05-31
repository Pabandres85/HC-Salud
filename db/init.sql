CREATE TABLE IF NOT EXISTS Usuarios (
    Id SERIAL PRIMARY KEY,
    NombreCompleto VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash TEXT NOT NULL,
    Rol VARCHAR(50) NOT NULL,
    CreadoEn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Pacientes (
    Id SERIAL PRIMARY KEY,
    NombreCompleto VARCHAR(100) NOT NULL,
    FechaNacimiento TIMESTAMP NOT NULL,
    Genero VARCHAR(20) NOT NULL,
    Direccion VARCHAR(200) NOT NULL,
    Telefono VARCHAR(20) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Ocupacion VARCHAR(100) NOT NULL,
    EstadoCivil VARCHAR(50) NOT NULL,
    Estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    UltimaConsulta TIMESTAMP,
    CreadoEn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario administrador por defecto
-- Password: Admin123!
INSERT INTO Usuarios (NombreCompleto, Correo, PasswordHash, Rol, CreadoEn)
VALUES (
    'Administrador del Sistema',
    'admin@psicologia.com',
    '$2a$11$GD4LFT2IxER8GfokLK5wYOphsKpfRvoOCCcIAECXsOP8bVHDnMXYq', -- Hash BCrypt para 'Admin123!' (generado por el backend)
    'admin',
    CURRENT_TIMESTAMP
) ON CONFLICT (Correo) DO NOTHING;

-- Tabla para historias clínicas
CREATE TABLE IF NOT EXISTS historiasclinicas (
    id SERIAL PRIMARY KEY,
    pacienteid INTEGER NOT NULL REFERENCES pacientes(id),
    fechaconsulta TIMESTAMP NOT NULL,
    subjetivo TEXT NOT NULL,
    objetivo TEXT NOT NULL,
    analisis TEXT NOT NULL,
    plan TEXT NOT NULL,
    creadoen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizadoen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para optimizar consultas por paciente
CREATE INDEX IF NOT EXISTS idx_historiasclinicas_pacienteid ON historiasclinicas(pacienteid);
CREATE INDEX IF NOT EXISTS idx_historiasclinicas_fechaconsulta ON historiasclinicas(fechaconsulta);

-- Tabla para anamnesis inicial del paciente
CREATE TABLE IF NOT EXISTS anamnesis (
    id SERIAL PRIMARY KEY,
    pacienteid INTEGER UNIQUE NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    graduacioninstruccion VARCHAR(100),
    religion VARCHAR(100),
    estructurafamiliar TEXT,
    informante VARCHAR(100),
    examinador VARCHAR(100),
    fechaentrevistainicial TIMESTAMP,
    motivoconsulta TEXT,
    problemaactual TEXT,
    observacionconducta TEXT,
    historiafamiliarmadre TEXT,
    historiafamiliarpadre TEXT,
    creadoen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizadoen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para la relación con pacientes (ya es UNIQUE PRIMARY KEY, pero un índice adicional puede ser útil)
CREATE INDEX IF NOT EXISTS idx_anamnesis_pacienteid ON anamnesis(pacienteid);

-- Añadir columna AnamnesisId a la tabla Pacientes para la relación 1 a 1 si es necesario (EF Core lo manejará con la FK en Anamnesis)
-- ALTER TABLE Pacientes ADD COLUMN AnamnesisId INTEGER UNIQUE REFERENCES Anamnesis(Id);

-- Asegurarse de que la relación en EF Core esté configurada para manejar la FK en Anamnesis

-- Tabla para Citas
CREATE TABLE IF NOT EXISTS Citas (
    Id SERIAL PRIMARY KEY,
    PacienteId INTEGER NOT NULL REFERENCES Pacientes(Id),
    FechaHora TIMESTAMP NOT NULL,
    Motivo TEXT,
    Estado VARCHAR(50) NOT NULL DEFAULT 'programada',
    CreadoEn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ActualizadoEn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para optimizar consultas por paciente y fecha
CREATE INDEX IF NOT EXISTS idx_citas_pacienteid ON Citas(PacienteId);
CREATE INDEX IF NOT EXISTS idx_citas_fechahora ON Citas(FechaHora);
