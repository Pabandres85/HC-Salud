export interface CitaResponse {
    id: number;
    pacienteId: number;
    pacienteNombreCompleto?: string | null; // Puede ser nulo si no se carga
    fechaHora: string; // Usamos string inicialmente para la fecha/hora recibida del backend
    motivo?: string | null;
    estado: string;
    creadoEn: string;
    actualizadoEn: string;
}

export interface CitaRequest {
    pacienteId: number;
    fechaHora: string; // Usamos string para enviar la fecha/hora
    motivo?: string | null;
    estado: string;
} 