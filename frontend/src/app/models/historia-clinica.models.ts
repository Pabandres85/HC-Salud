import { Paciente } from "./paciente.models";

export interface HistoriaClinicaResponse {
    id: number;
    pacienteId: number;
    fechaConsulta: string; // Usamos string para la fecha inicialmente
    subjetivo: string;
    objetivo: string;
    analisis: string;
    plan: string;
    creadoEn: string; // Usamos string para la fecha inicialmente
    actualizadoEn: string; // Usamos string para la fecha inicialmente
}

export interface HistoriaClinicaRequest {
    pacienteId: number;
    fechaConsulta: string; // Usamos string para la fecha inicialmente
    subjetivo: string;
    objetivo: string;
    analisis: string;
    plan: string;
}

export interface HistoriasClinicasResponse {
    data: HistoriaClinicaResponse[];
    total: number;
    pagina: number;
    itemsPorPagina: number;
} 