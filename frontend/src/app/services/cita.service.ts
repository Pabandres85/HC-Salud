import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CitaRequest, CitaResponse } from '../models/cita.models';
import { PaginatedResponse } from '../models/common.models';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = `${environment.apiUrl}/api/cita`;

  constructor(private http: HttpClient) { }

  // Crear nueva cita
  createCita(cita: CitaRequest): Observable<CitaResponse> {
    return this.http.post<CitaResponse>(this.apiUrl, cita);
  }

  // Obtener cita por ID
  getCitaById(id: number): Observable<CitaResponse> {
    return this.http.get<CitaResponse>(`${this.apiUrl}/${id}`);
  }

  // Obtener citas por paciente
  getCitasByPacienteId(pacienteId: number): Observable<CitaResponse[]> {
    return this.http.get<CitaResponse[]>(`${this.apiUrl}/byPaciente/${pacienteId}`);
  }

  // Obtener todas las citas con paginación
  getAllCitas(pageNumber: number, pageSize: number): Observable<PaginatedResponse<CitaResponse>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResponse<CitaResponse>>(this.apiUrl, { params });
  }

  // Actualizar cita
  updateCita(id: number, cita: CitaRequest): Observable<CitaResponse> {
    return this.http.put<CitaResponse>(`${this.apiUrl}/${id}`, cita);
  }

  // Eliminar cita
  deleteCita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Nota: El método para obtener el contador de citas para hoy se obtiene a través del DashboardService.
} 