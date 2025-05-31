export interface AnamnesisResponse {
    id: number;
    pacienteId: number;
    pacienteNombreCompleto: string | null;
    gradoInstruccion: string | null;
    religion: string | null;
    estructuraFamiliar: string | null;
    informante: string | null;
    examinador: string | null;
    fechaEntrevistaInicial: string | null;
    motivoConsulta: string | null;
    problemaActual: string | null;
    observacionConducta: string | null;
    historiaFamiliarMadre: string | null;
    historiaFamiliarPadre: string | null;
    creadoEn: string;
    actualizadoEn: string;
}

export interface AnamnesisRequest {
    pacienteId: number;
    gradoInstruccion?: string | null;
    religion?: string | null;
    estructuraFamiliar?: string | null;
    informante?: string | null;
    examinador?: string | null;
    fechaEntrevistaInicial?: string | null;
    motivoConsulta: string;
    problemaActual: string;
    observacionConducta?: string | null;
    historiaFamiliarMadre?: string | null;
    historiaFamiliarPadre?: string | null;
}