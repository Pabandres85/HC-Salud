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
