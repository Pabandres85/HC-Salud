import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AnamnesisRequest, AnamnesisResponse } from '../models/anamnesis.models';

@Injectable({
  providedIn: 'root'
})
export class AnamnesisService {
  private apiUrl = `${environment.apiUrl}/api/Anamnesis`;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido.';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend retornó un código de respuesta no exitoso (ej. 400, 404, 500)
      console.error(
        `Código retornado por el backend ${error.status}, ` +
        `cuerpo del error: ${error.error}`
      );

      if (error.status === 400) {
        // Si el backend envía un mensaje de error específico en el cuerpo
        errorMessage = error.error.message || 'Datos inválidos. Por favor, revise los campos.';
      } else if (error.status === 404) {
         errorMessage = 'Recurso no encontrado.';
      } else if (error.status === 500) {
         errorMessage = 'Error interno del servidor. Inténtelo de nuevo más tarde.';
      } else {
        errorMessage = `Error del servidor: ${error.status}`;
      }
    }

    // Devolver un observable con un mensaje de error para que el componente lo maneje
    return throwError(() => new Error(errorMessage));
  }

  // Método para obtener la anamnesis de un paciente por su ID
  getAnamnesisByPacienteId(pacienteId: number): Observable<AnamnesisResponse> {
    return this.http.get<AnamnesisResponse>(`${this.apiUrl}/paciente/${pacienteId}`)
      .pipe(catchError(this.handleError));
  }

  // Método para crear una nueva anamnesis
  createAnamnesis(anamnesis: AnamnesisRequest): Observable<AnamnesisResponse> {
    return this.http.post<AnamnesisResponse>(this.apiUrl, anamnesis)
      .pipe(catchError(this.handleError));
  }

  // Método para actualizar una anamnesis existente
  updateAnamnesis(id: number, anamnesis: AnamnesisRequest): Observable<AnamnesisResponse> {
    return this.http.put<AnamnesisResponse>(`${this.apiUrl}/${id}`, anamnesis)
      .pipe(catchError(this.handleError));
  }

  // Método para eliminar una anamnesis
  deleteAnamnesis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
} 