import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Paciente, PacienteRequest, PacienteResponse, PacientesResponse } from '../models/paciente.models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PacienteService {
    private apiUrl = `${environment.apiUrl}/api/paciente`;

    constructor(private http: HttpClient) {}

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Ha ocurrido un error';
        
        if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = error.error.message;
        } else {
            // Error del servidor
            if (error.status === 400) {
                if (error.error?.message?.includes('correo')) {
                    errorMessage = 'El correo electrónico ya está registrado';
                } else {
                    errorMessage = 'Datos inválidos. Por favor, revise los campos';
                }
            } else if (error.status === 404) {
                errorMessage = 'Paciente no encontrado';
            } else if (error.status === 500) {
                errorMessage = 'Error interno del servidor';
            }
        }
        
        return throwError(() => new Error(errorMessage));
    }

    getPacientes(page: number = 1, limit: number = 10): Observable<PacientesResponse> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.http.get<PacientesResponse>(this.apiUrl, { params })
            .pipe(catchError(this.handleError));
    }

    getPaciente(id: number): Observable<PacienteResponse> {
        return this.http.get<PacienteResponse>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    crearPaciente(paciente: PacienteRequest): Observable<PacienteResponse> {
        return this.http.post<PacienteResponse>(this.apiUrl, paciente)
            .pipe(catchError(this.handleError));
    }

    actualizarPaciente(id: number, paciente: PacienteRequest): Observable<PacienteResponse> {
        return this.http.put<PacienteResponse>(`${this.apiUrl}/${id}`, paciente)
            .pipe(catchError(this.handleError));
    }

    eliminarPaciente(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    cambiarEstado(id: number, estado: 'activo' | 'inactivo'): Observable<PacienteResponse> {
        return this.http.patch<PacienteResponse>(`${this.apiUrl}/${id}/estado`, { estado });
    }
} 