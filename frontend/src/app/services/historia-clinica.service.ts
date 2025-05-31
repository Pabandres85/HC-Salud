import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HistoriaClinicaRequest, HistoriaClinicaResponse, HistoriasClinicasResponse } from '../models/historia-clinica.models';

@Injectable({
    providedIn: 'root'
})
export class HistoriaClinicaService {
    private apiUrl = `${environment.apiUrl}/api/HistoriaClinica`;

    constructor(private http: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Ha ocurrido un error';
        
        if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = error.error.message;
        } else {
            // Error del servidor
            if (error.status === 400) {
                errorMessage = 'Datos inválidos. Por favor, revise los campos';
            } else if (error.status === 404) {
                errorMessage = 'Historia clínica no encontrada';
            } else if (error.status === 500) {
                errorMessage = 'Error interno del servidor';
            }
        }
        
        return throwError(() => new Error(errorMessage));
    }

    getHistoriasClinicas(page: number = 1, pageSize: number = 10): Observable<HistoriasClinicasResponse> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<HistoriasClinicasResponse>(this.apiUrl, { params })
            .pipe(catchError(this.handleError));
    }

    getHistoriasClinicasByPaciente(pacienteId: number, page: number = 1, pageSize: number = 10): Observable<HistoriasClinicasResponse> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<HistoriasClinicasResponse>(`${this.apiUrl}/paciente/${pacienteId}`, { params })
            .pipe(catchError(this.handleError));
    }

    getHistoriaClinica(id: number): Observable<HistoriaClinicaResponse> {
        return this.http.get<HistoriaClinicaResponse>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    crearHistoriaClinica(historiaClinica: HistoriaClinicaRequest): Observable<HistoriaClinicaResponse> {
        return this.http.post<HistoriaClinicaResponse>(this.apiUrl, historiaClinica)
            .pipe(catchError(this.handleError));
    }

    actualizarHistoriaClinica(id: number, historiaClinica: HistoriaClinicaRequest): Observable<HistoriaClinicaResponse> {
        return this.http.put<HistoriaClinicaResponse>(`${this.apiUrl}/${id}`, historiaClinica)
            .pipe(catchError(this.handleError));
    }

    eliminarHistoriaClinica(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }
} 