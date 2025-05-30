export interface Paciente {
    id: number;
    nombreCompleto: string;
    fechaNacimiento: Date;
    genero: string;
    direccion: string;
    telefono: string;
    correo: string;
    ocupacion: string;
    estadoCivil: string;
    fechaRegistro: Date;
    ultimaConsulta?: Date;
    estado: 'activo' | 'inactivo';
}

export interface PacienteRequest {
    nombreCompleto: string;
    fechaNacimiento: Date;
    genero: string;
    direccion: string;
    telefono: string;
    correo: string;
    ocupacion: string;
    estadoCivil: string;
}

export interface PacienteResponse {
    success: boolean;
    message: string;
    data?: Paciente;
}

export interface PacientesResponse {
    success: boolean;
    data: Paciente[];
    total: number;
} 