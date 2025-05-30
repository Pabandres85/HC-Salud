import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoriaClinicaService } from '../../../../services/historia-clinica.service';
import { HistoriaClinicaResponse } from '../../../../models/historia-clinica.models';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-historia-clinica-detail',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
    <div class="card">
      <div *ngIf="historiaClinica; else loading">
        <h2>Detalle de Historia Clínica #{{ historiaClinica.id }}</h2>
        <p><strong>Paciente ID:</strong> {{ historiaClinica.pacienteId }}</p>
        <p><strong>Fecha de Consulta:</strong> {{ historiaClinica.fechaConsulta | date:'dd/MM/yyyy HH:mm' }}</p>
        
        <h3>Subjetivo:</h3>
        <p>{{ historiaClinica.subjetivo }}</p>

        <h3>Objetivo:</h3>
        <p>{{ historiaClinica.objetivo }}</p>

        <h3>Análisis:</h3>
        <p>{{ historiaClinica.analisis }}</p>

        <h3>Plan:</h3>
        <p>{{ historiaClinica.plan }}</p>

        <p><strong>Creado En:</strong> {{ historiaClinica.creadoEn | date:'dd/MM/yyyy HH:mm' }}</p>
        <p><strong>Actualizado En:</strong> {{ historiaClinica.actualizadoEn | date:'dd/MM/yyyy HH:mm' }}</p>

        <div class="mt-4">
           <button (click)="editarHistoriaClinica()" class="btn btn-secondary">Editar</button>
           <button (click)="regresar()" class="btn btn-secondary ml-2">Regresar a la Lista</button>
        </div>

      </div>
      <ng-template #loading>
         <p>Cargando historia clínica...</p>
      </ng-template>
       <div *ngIf="errorMessage">
           <p class="text-red-500">Error: {{ errorMessage }}</p>
       </div>
    </div>
  `,
  styles: [
    `
      .card {
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .mt-4 {
        margin-top: 1rem;
      }
      .ml-2 {
        margin-left: 0.5rem;
      }
      .btn {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 1rem;
      }
       .btn-secondary {
        background-color: #e2e8f0;
        color: #333;
        border: none;
      }
      .btn-secondary:hover {
        background-color: #cbd5e1;
      }
       .text-red-500 {
           color: #ef4444;
       }
    `
  ]
})
export class HistoriaClinicaDetailComponent implements OnInit {

  historiaClinica: HistoriaClinicaResponse | null = null;
  historiaClinicaId: number | null = null;
  pacienteId: number | null = null; // Para regresar a la lista correcta
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private historiaClinicaService: HistoriaClinicaService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.historiaClinicaId = +id;
        this.cargarHistoriaClinica();
      } else {
        console.error('ID de historia clínica no proporcionado.');
        this.errorMessage = 'ID de historia clínica no proporcionado.';
        // Opcional: Redirigir a una página de error
      }
    });
  }

  cargarHistoriaClinica() {
    if (this.historiaClinicaId !== null) {
      this.historiaClinicaService.getHistoriaClinica(this.historiaClinicaId)
        .pipe( // Usar pipe para manejar errores
          catchError((error) => {
            console.error('Error al cargar historia clínica:', error);
            this.errorMessage = 'Error al cargar la historia clínica.';
            return of(null); // Retornar un observable nulo para continuar el flujo
          })
        )
        .subscribe(historia => {
          if (historia) {
             this.historiaClinica = historia;
             this.pacienteId = historia.pacienteId; // Guardar pacienteId para navegación
             console.log('Historia clínica cargada:', this.historiaClinica);
          }
        });
    }
  }

  editarHistoriaClinica() {
     if (this.historiaClinicaId !== null) {
         this.router.navigate(['/dashboard/historias-clinicas', this.historiaClinicaId, 'editar']);
     }
  }

  regresar() {
      if (this.pacienteId !== null) {
          this.router.navigate(['/dashboard/pacientes', this.pacienteId, 'historias-clinicas']);
      } else {
          // Fallback si no tenemos el pacienteId
          this.router.navigate(['/dashboard/pacientes']);
      }
  }

} 