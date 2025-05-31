import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CitaService } from '../../../../services/cita.service';
import { CitaResponse } from '../../../../models/cita.models';
import { PaginatedResponse } from '../../../../models/common.models'; // Asegúrate de tener este modelo
import { Observable, catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-cita-general-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2>Listado General de Citas</h2>
        <!-- Opcional: Botón para crear nueva cita general si la ruta lo permite, o redirigir a paciente -->
        <!-- <button [routerLink]="['/dashboard/citas/nueva']" class="btn btn-primary">Nueva Cita</button> -->
      </div>

      <div *ngIf="citas$ | async as paginationResponse; else loading">
        <div *ngIf="paginationResponse.data.length === 0">
          <p>No hay citas registradas en el sistema.</p>
        </div>

        <div *ngIf="paginationResponse.data.length > 0">
          <table class="table w-full">
            <thead>
              <tr>
                <th class="text-left">Fecha y Hora</th>
                <th class="text-left">Paciente</th>
                <th class="text-left">Motivo</th>
                <th class="text-left">Estado</th>
                <th class="text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cita of paginationResponse.data">
                <td>{{ cita.fechaHora | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ cita.pacienteNombreCompleto || 'N/A' }}</td>
                <td>{{ cita.motivo || 'Sin motivo especificado' }}</td>
                <td>{{ cita.estado }}</td>
                <td>
                  <!-- Enlace para editar: requiere navegar a la ruta de edición con pacienteId y citaId -->
                  <button [routerLink]="['/dashboard/pacientes', cita.pacienteId, 'citas', cita.id, 'editar']" class="btn-link">Editar</button>
                  <!-- Botón para eliminar -->
                  <button (click)="eliminarCita(cita.id)" class="btn-link ml-2 text-red-600">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="pagination">
          <button (click)="cambiarPagina(paginationResponse.page - 1)" [disabled]="paginationResponse.page === 1" class="btn-pag">Anterior</button>
          <span>Página {{ paginationResponse.page }} de {{ totalPaginas }}</span>
          <button (click)="cambiarPagina(paginationResponse.page + 1)" [disabled]="paginationResponse.page === totalPaginas" class="btn-pag">Siguiente</button>
        </div>

      </div>

      <ng-template #loading>
        <p>Cargando citas...</p>
      </ng-template>

      <div *ngIf="errorMessage" class="text-red-500 mt-4">
        {{ errorMessage }}
      </div>

    </div>
  `,
  styles: [
    `
      /* Reutilizar estilos de .card, .flex, .justify-between, .items-center, .mb-4, .mt-4 de otros componentes */
      /* Reutilizar estilos de .btn-primary, .table, .btn-link, .text-red-600, .ml-2 de otros componentes */

      .card {
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .flex {
        display: flex;
      }
      .justify-between {
        justify-content: space-between;
      }
      .items-center {
        align-items: center;
      }
       .mb-4 {
        margin-bottom: 1rem;
      }
       .mt-4 {
        margin-top: 1rem;
      }
       .btn-primary {
        background-color: #4f46e5;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 1rem;
      }
      .btn-primary:hover {
        background-color: #4338ca;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
      }
      .table th,
      .table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }
      .table th {
        background-color: #f8fafc;
        font-weight: 600;
        color: #334155;
      }
      .btn-link {
        background: none;
        border: none;
        color: #4f46e5;
        cursor: pointer;
        text-decoration: underline;
        padding: 0;
        font-size: 1rem;
      }
      .btn-link:hover {
        color: #4338ca;
      }
      .text-red-600 {
        color: #dc2626;
      }
       .text-red-600:hover {
        color: #b91c1c;
      }
      .ml-2 {
        margin-left: 0.5rem;
      }
      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 1.5rem;
      }
      .btn-pag {
        padding: 0.4rem 0.8rem;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        background-color: #fff;
        cursor: pointer;
      }
      .btn-pag:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `
  ]
})
export class CitaGeneralListComponent implements OnInit {
  citas$: Observable<PaginatedResponse<CitaResponse>> | null = null;
  errorMessage: string | null = null;
  currentPage = 1;
  pageSize = 10;
  totalPaginas = 0;
  Math = Math; // Hacer Math accesible en la plantilla

  constructor(
    private citaService: CitaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.errorMessage = null;
    this.citas$ = this.citaService.getAllCitas(this.currentPage, this.pageSize).pipe(
      tap(response => {
        this.totalPaginas = Math.ceil(response.total / this.pageSize);
      }),
      catchError(error => {
        console.error('Error al cargar todas las citas:', error);
        this.errorMessage = 'Error al cargar las citas.';
        if (error.error && error.error.message) {
             this.errorMessage = 'Error: ' + error.error.message;
        }
        return of({ data: [], total: 0, page: this.currentPage, pageSize: this.pageSize }); // Devolver estructura paginada vacía en error
      })
    );
  }

  cambiarPagina(page: number): void {
    if (page >= 1 && page <= this.totalPaginas) {
      this.currentPage = page;
      this.cargarCitas();
    }
  }

  // Método para eliminar una cita
  eliminarCita(citaId: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta cita?')) {
      this.citaService.deleteCita(citaId).subscribe({
        next: () => {
          console.log('Cita eliminada con éxito');
          // Recargar la lista de citas después de eliminar
          this.cargarCitas();
        },
        error: (error) => {
          console.error('Error al eliminar cita:', error);
           this.errorMessage = 'Error al eliminar la cita.';
            if (error.error && error.error.message) {
                 this.errorMessage = 'Error: ' + error.error.message;
            }
        }
      });
    }
  }

  // La navegación a editar se maneja con routerLink en la plantilla
  // editarCita(citaId: number): void {
  //   // Navegar al formulario de edición, necesitamos el pacienteId para la ruta
  //   // Esto puede requerir obtener el pacienteId de la cita primero si no está en el modelo de respuesta (ya lo añadimos)
  //   // const cita = /* encontrar cita en la lista */; 
  //   // if (cita) {
  //   //    this.router.navigate(['/dashboard/pacientes', cita.pacienteId, 'citas', cita.id, 'editar']);
  //   // }
  // }
}

// Asegúrate de tener una interfaz PaginatedResponse en tus modelos comunes
// Por ejemplo, en frontend/src/app/models/common.models.ts
// export interface PaginatedResponse<T> {
//   data: T[];
//   total: number;
//   page: number;
//   pageSize: number;
// } 