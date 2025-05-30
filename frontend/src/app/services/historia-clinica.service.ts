import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistoriasClinicasResponse, HistoriaClinicaResponse, HistoriaClinicaRequest } from '../models/historia-clinica.models'; // Asumir que crearemos estos modelos en frontend

@Injectable({
    providedIn: 'root'
})
export class HistoriaClinicaService {
    private apiUrl = `${environment.apiUrl}/api/historiaclinica`;

    constructor(private http: HttpClient) { }

    getHistoriasClinicasByPaciente(pacienteId: number, pagina: number = 1, itemsPorPagina: number = 10): Observable<HistoriasClinicasResponse> {
        const params = new HttpParams()
            .set('pagina', pagina.toString())
            .set('itemsPorPagina', itemsPorPagina.toString());
            
        return this.http.get<HistoriasClinicasResponse>(`${this.apiUrl}/paciente/${pacienteId}`, { params });
    }

    getHistoriaClinica(id: number): Observable<HistoriaClinicaResponse> {
        return this.http.get<HistoriaClinicaResponse>(`${this.apiUrl}/${id}`);
    }

    crearHistoriaClinica(request: HistoriaClinicaRequest): Observable<HistoriaClinicaResponse> {
        return this.http.post<HistoriaClinicaResponse>(this.apiUrl, request);
    }

    actualizarHistoriaClinica(id: number, request: HistoriaClinicaRequest): Observable<HistoriaClinicaResponse> {
        return this.http.put<HistoriaClinicaResponse>(`${this.apiUrl}/${id}`, request);
    }

    eliminarHistoriaClinica(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
} 