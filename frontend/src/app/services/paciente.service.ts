import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente, PacienteRequest, PacienteResponse, PacientesResponse } from '../models/paciente.models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PacienteService {
    private apiUrl = `${environment.apiUrl}/api/paciente`;

    constructor(private http: HttpClient) {}

    getPacientes(page: number = 1, limit: number = 10): Observable<PacientesResponse> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.http.get<PacientesResponse>(this.apiUrl, { params });
    }

    getPaciente(id: number): Observable<PacienteResponse> {
        return this.http.get<PacienteResponse>(`${this.apiUrl}/${id}`);
    }

    crearPaciente(paciente: PacienteRequest): Observable<PacienteResponse> {
        return this.http.post<PacienteResponse>(this.apiUrl, paciente);
    }

    actualizarPaciente(id: number, paciente: PacienteRequest): Observable<PacienteResponse> {
        return this.http.put<PacienteResponse>(`${this.apiUrl}/${id}`, paciente);
    }

    eliminarPaciente(id: number): Observable<PacienteResponse> {
        return this.http.delete<PacienteResponse>(`${this.apiUrl}/${id}`);
    }

    cambiarEstado(id: number, estado: 'activo' | 'inactivo'): Observable<PacienteResponse> {
        return this.http.patch<PacienteResponse>(`${this.apiUrl}/${id}/estado`, { estado });
    }
} 