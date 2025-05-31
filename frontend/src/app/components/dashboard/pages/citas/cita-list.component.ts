import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CitaService } from '../../../../services/cita.service';
import { CitaResponse } from '../../../../models/cita.models';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // Importar RouterModule para routerLink
  ],
  template: `
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2>Citas del Paciente</h2>
        <button *ngIf="pacienteId !== null" [routerLink]="['nueva']" class="btn btn-primary">Nueva Cita</button>
      </div>

      <div *ngIf="citas$ | async as citas; else loading">
        <div *ngIf="citas.length === 0">
          <p>No hay citas programadas para este paciente.</p>
        </div>

        <div *ngIf="citas.length > 0">
          <table class="table w-full">
            <thead>
              <tr>
                <th class="text-left">Fecha y Hora</th>
                <th class="text-left">Motivo</th>
                <th class="text-left">Estado</th>
                <th class="text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cita of citas">
                <td>{{ cita.fechaHora | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ cita.motivo || 'Sin motivo especificado' }}</td>
                <td>{{ cita.estado }}</td>
                <td>
                  <button [routerLink]="[cita.id, 'editar']" class="btn-link">Editar</button>
                  <button (click)="eliminarCita(cita.id)" class="btn-link ml-2 text-red-600">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
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
      /* Estilos generales de tarjeta */
      .card {
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      /* Utilidades Flexbox */
      .flex {
        display: flex;
      }
      .justify-between {
        justify-content: space-between;
      }
      .items-center {
        align-items: center;
      }
      /* Margen inferior */
      .mb-4 {
        margin-bottom: 1rem;
      }
       .mt-4 {
        margin-top: 1rem;
      }
      /* Estilos de botón primario */
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
      /* Estilos de tabla */
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
      /* Estilos de botón de enlace */
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
      /* Estilo específico para botón de eliminar */
      .text-red-600 {
        color: #dc2626;
      }
       .text-red-600:hover {
        color: #b91c1c;
      }
      .ml-2 {
        margin-left: 0.5rem;
      }
    `
  ]
})
export class CitaListComponent implements OnInit {
  pacienteId: number | null = null;
  citas$: Observable<CitaResponse[]> | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private citaService: CitaService
  ) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const pacienteIdParam = params.get('pacienteId');
      if (pacienteIdParam) {
        this.pacienteId = +pacienteIdParam; // Convertir a número
        this.cargarCitas(this.pacienteId);
      } else {
        // Manejar el caso en que no se encuentra pacienteId (opcional)
        this.errorMessage = 'No se proporcionó un ID de paciente.';
        this.citas$ = of([]); // Vaciar la lista
      }
    });
  }

  cargarCitas(pacienteId: number): void {
    this.citas$ = this.citaService.getCitasByPacienteId(pacienteId).pipe(
      catchError(error => {
        console.error('Error al cargar citas:', error);
        this.errorMessage = 'Error al cargar las citas.';
        if (error.error && error.error.message) {
             this.errorMessage = 'Error: ' + error.error.message;
        }
        return of([]); // Retorna un observable de un array vacío en caso de error
      })
    );
  }

  // Método para navegar al formulario de creación de cita
  // La navegación se maneja con routerLink en la plantilla
  // crearCita(): void {
  //   if (this.pacienteId !== null) {
  //     this.router.navigate(['nueva'], { relativeTo: this.route });
  //   }
  // }

  // Método para navegar al formulario de edición de cita
  // La navegación se maneja con routerLink en la plantilla
  // editarCita(citaId: number): void {
  //    this.router.navigate([citaId, 'editar'], { relativeTo: this.route });
  // }

  // Método para eliminar una cita
  eliminarCita(citaId: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta cita?')) {
      this.citaService.deleteCita(citaId).subscribe({
        next: () => {
          console.log('Cita eliminada con éxito');
          // Recargar la lista de citas después de eliminar
          if (this.pacienteId !== null) {
            this.cargarCitas(this.pacienteId);
          }
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
} 