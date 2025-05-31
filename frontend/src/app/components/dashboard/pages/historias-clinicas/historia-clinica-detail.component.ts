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
        <div class="header">
          <h2>Nota de Progreso #{{ historiaClinica.id }}</h2>
          <div class="actions">
            <button (click)="editarHistoriaClinica()" class="btn btn-secondary">Editar</button>
            <button (click)="regresar()" class="btn btn-secondary">Regresar</button>
          </div>
        </div>

        <div class="info-section">
          <p><strong>Fecha de Consulta:</strong> {{ historiaClinica.fechaConsulta | date:'dd/MM/yyyy HH:mm' }}</p>
          <p><strong>Creado En:</strong> {{ historiaClinica.creadoEn | date:'dd/MM/yyyy HH:mm' }}</p>
          <p><strong>Actualizado En:</strong> {{ historiaClinica.actualizadoEn | date:'dd/MM/yyyy HH:mm' }}</p>
        </div>
        
        <div class="content-section">
          <div class="section">
            <h3>Subjetivo</h3>
            <p>{{ historiaClinica.subjetivo }}</p>
          </div>

          <div class="section">
            <h3>Objetivo</h3>
            <p>{{ historiaClinica.objetivo }}</p>
          </div>

          <div class="section">
            <h3>Análisis</h3>
            <p>{{ historiaClinica.analisis }}</p>
          </div>

          <div class="section">
            <h3>Plan</h3>
            <p>{{ historiaClinica.plan }}</p>
          </div>
        </div>
      </div>
      <ng-template #loading>
         <p>Cargando nota de progreso...</p>
      </ng-template>
      <div *ngIf="errorMessage" class="error-alert">
          <p>{{ errorMessage }}</p>
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
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }
      .actions {
        display: flex;
        gap: 1rem;
      }
      .info-section {
        background-color: #f8fafc;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 2rem;
      }
      .info-section p {
        margin: 0.5rem 0;
        color: #334155;
      }
      .content-section {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
      .section {
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        padding: 1rem;
      }
      .section h3 {
        color: #334155;
        margin-bottom: 1rem;
        font-size: 1.25rem;
      }
      .section p {
        color: #475569;
        line-height: 1.6;
        white-space: pre-wrap;
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
      .error-alert {
        background-color: #fee2e2;
        border: 1px solid #ef4444;
        color: #b91c1c;
        padding: 0.75rem;
        border-radius: 0.375rem;
        margin-top: 1rem;
        font-size: 0.875rem;
      }
    `
  ]
})
export class HistoriaClinicaDetailComponent implements OnInit {
  historiaClinica: HistoriaClinicaResponse | null = null;
  historiaClinicaId: number | null = null;
  pacienteId: number | null = null;
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
      }
    });
  }

  cargarHistoriaClinica() {
    if (this.historiaClinicaId !== null) {
      this.historiaClinicaService.getHistoriaClinica(this.historiaClinicaId)
        .pipe(
          catchError((error) => {
            console.error('Error al cargar historia clínica:', error);
            this.errorMessage = 'Error al cargar la historia clínica.';
            return of(null);
          })
        )
        .subscribe(historia => {
          if (historia) {
            this.historiaClinica = historia;
            this.pacienteId = historia.pacienteId;
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
      this.router.navigate(['/dashboard/pacientes', this.pacienteId, 'historia-clinica']);
    } else {
      this.router.navigate(['/dashboard/pacientes']);
    }
  }
} 