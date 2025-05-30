export interface LoginRequest {
    correo: string;
    password: string;
}

export interface RegistroRequest {
    nombreCompleto: string;
    correo: string;
    password: string;
    confirmarPassword: string;
    rol: string;
}

export interface AuthResponse {
    token: string;
    rol: string;
    nombreCompleto: string;
    correo: string;
}

export interface RegistroResponse {
    success: boolean;
    message: string;
}

export interface Usuario {
    id: number;
    nombreCompleto: string;
    correo: string;
    rol: string;
    creadoEn: Date;
} 