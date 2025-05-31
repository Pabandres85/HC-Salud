import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoriaClinicaService } from '../../../../services/historia-clinica.service';
import { HistoriaClinicaRequest } from '../../../../models/historia-clinica.models';
import { HistoriaClinicaResponse } from '../../../../models/historia-clinica.models';

@Component({
  selector: 'app-historia-clinica-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="card">
      <h2>{{ esEdicion ? 'Editar Historia Clínica' : 'Nueva Historia Clínica' }}</h2>

      <div *ngIf="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>

      <form [formGroup]="historiaClinicaForm" (ngSubmit)="guardarHistoriaClinica()">
        <div class="form-field">
          <label for="fechaConsulta">Fecha de Consulta</label>
          <input type="date" id="fechaConsulta" formControlName="fechaConsulta" [class.error]="historiaClinicaForm.get('fechaConsulta')?.invalid && historiaClinicaForm.get('fechaConsulta')?.touched">
          <div class="error-message" *ngIf="historiaClinicaForm.get('fechaConsulta')?.invalid && historiaClinicaForm.get('fechaConsulta')?.touched">
            La fecha de consulta es requerida
          </div>
        </div>
        <div class="form-field">
          <label for="subjetivo">Subjetivo</label>
          <textarea id="subjetivo" formControlName="subjetivo" [class.error]="historiaClinicaForm.get('subjetivo')?.invalid && historiaClinicaForm.get('subjetivo')?.touched"></textarea>
          <div class="error-message" *ngIf="historiaClinicaForm.get('subjetivo')?.invalid && historiaClinicaForm.get('subjetivo')?.touched">
            El campo subjetivo es requerido
          </div>
        </div>
        <div class="form-field">
          <label for="objetivo">Objetivo</label>
          <textarea id="objetivo" formControlName="objetivo" [class.error]="historiaClinicaForm.get('objetivo')?.invalid && historiaClinicaForm.get('objetivo')?.touched"></textarea>
          <div class="error-message" *ngIf="historiaClinicaForm.get('objetivo')?.invalid && historiaClinicaForm.get('objetivo')?.touched">
            El campo objetivo es requerido
          </div>
        </div>
        <div class="form-field">
          <label for="analisis">Análisis</label>
          <textarea id="analisis" formControlName="analisis" [class.error]="historiaClinicaForm.get('analisis')?.invalid && historiaClinicaForm.get('analisis')?.touched"></textarea>
          <div class="error-message" *ngIf="historiaClinicaForm.get('analisis')?.invalid && historiaClinicaForm.get('analisis')?.touched">
            El campo análisis es requerido
          </div>
        </div>
        <div class="form-field">
          <label for="plan">Plan</label>
          <textarea id="plan" formControlName="plan" [class.error]="historiaClinicaForm.get('plan')?.invalid && historiaClinicaForm.get('plan')?.touched"></textarea>
          <div class="error-message" *ngIf="historiaClinicaForm.get('plan')?.invalid && historiaClinicaForm.get('plan')?.touched">
            El campo plan es requerido
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Guardar</button>
          <button type="button" (click)="cancelar()" class="btn btn-secondary">Cancelar</button>
        </div>
      </form>
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
      .form-field {
        margin-bottom: 1rem;
      }
      .form-field label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
      .form-field input[type="date"],
      .form-field textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .form-actions {
        margin-top: 1.5rem;
        text-align: right;
      }
      .btn {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 1rem;
        margin-left: 0.5rem;
      }
      .btn-primary {
        background-color: #4f46e5;
        color: white;
        border: none;
      }
      .btn-primary:hover {
        background-color: #4338ca;
      }
      .btn-secondary {
        background-color: #e2e8f0;
        color: #333;
        border: none;
      }
      .btn-secondary:hover {
        background-color: #cbd5e1;
      }
      .error {
        border-color: #ef4444 !important;
      }
      .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
      .error-alert {
        background-color: #fee2e2;
        border: 1px solid #ef4444;
        color: #b91c1c;
        padding: 0.75rem;
        border-radius: 0.375rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
      }
    `
  ]
})
export class HistoriaClinicaFormComponent implements OnInit {

  historiaClinicaForm: FormGroup;
  esEdicion = false;
  historiaClinicaId: number | null = null;
  pacienteId: number | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private historiaClinicaService: HistoriaClinicaService
  ) {
    this.historiaClinicaForm = this.fb.group({
      fechaConsulta: ['', Validators.required],
      subjetivo: ['', Validators.required],
      objetivo: ['', Validators.required],
      analisis: ['', Validators.required],
      plan: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const historiaClinicaId = params.get('id');
      const pacienteId = params.get('pacienteId');

      if (historiaClinicaId) {
        this.esEdicion = true;
        this.historiaClinicaId = +historiaClinicaId;
        console.log('Modo edición: Historia Clínica ID', this.historiaClinicaId);
        
        this.historiaClinicaService.getHistoriaClinica(this.historiaClinicaId)
          .subscribe({
            next: (historia) => {
              this.pacienteId = historia.pacienteId;
              this.historiaClinicaForm.patchValue({
                fechaConsulta: historia.fechaConsulta.split('T')[0],
                subjetivo: historia.subjetivo,
                objetivo: historia.objetivo,
                analisis: historia.analisis,
                plan: historia.plan
              });
               console.log('Datos de historia clínica cargados:', historia);
            },
            error: (error) => {
              console.error('Error al cargar historia clínica:', error);
              this.errorMessage = error.message;
            }
          });

      } else if (pacienteId) {
        this.esEdicion = false;
        this.pacienteId = +pacienteId;
         console.log('Modo creación: Paciente ID', this.pacienteId);
      } else {
         console.error('Error: No se encontró ID de paciente ni de historia clínica en la ruta.');
         this.errorMessage = 'No se pudo determinar el paciente o la historia clínica';
      }
    });
  }

  guardarHistoriaClinica() {
    if (this.historiaClinicaForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    if (this.pacienteId !== null) {
      this.errorMessage = null;
      const formData: HistoriaClinicaRequest = {
        pacienteId: this.pacienteId,
        fechaConsulta: this.historiaClinicaForm.value.fechaConsulta,
        subjetivo: this.historiaClinicaForm.value.subjetivo,
        objetivo: this.historiaClinicaForm.value.objetivo,
        analisis: this.historiaClinicaForm.value.analisis,
        plan: this.historiaClinicaForm.value.plan
      };

      console.log('Datos del formulario a guardar:', formData);

      if (this.esEdicion && this.historiaClinicaId !== null) {
        this.historiaClinicaService.actualizarHistoriaClinica(this.historiaClinicaId, formData)
          .subscribe({
            next: (response) => {
              console.log('Historia clínica actualizada con éxito', response);
              this.router.navigate(['/dashboard/pacientes', this.pacienteId, 'historias-clinicas']);
            },
            error: (error) => {
              console.error('Error al actualizar historia clínica:', error);
              this.errorMessage = error.message;
            }
          });
      } else {
        this.historiaClinicaService.crearHistoriaClinica(formData)
          .subscribe({
            next: (response) => {
              console.log('Historia clínica creada con éxito', response);
              this.router.navigate(['/dashboard/pacientes', this.pacienteId, 'historias-clinicas']);
            },
            error: (error) => {
              console.error('Error al crear historia clínica:', error);
              this.errorMessage = error.message;
            }
          });
      }
    } else {
      this.errorMessage = 'No se pudo determinar el paciente';
    }
  }

  private marcarCamposComoTocados() {
    Object.keys(this.historiaClinicaForm.controls).forEach(key => {
      const control = this.historiaClinicaForm.get(key);
      control?.markAsTouched();
    });
  }

  cancelar() {
    console.log('Formulario cancelado');
    if (this.pacienteId !== null) {
       this.router.navigate(['/dashboard/pacientes', this.pacienteId, 'historias-clinicas']);
    } else if (this.esEdicion && this.historiaClinicaId !== null) {
       console.warn('No se pudo determinar el pacienteId para cancelar desde edición.');
        this.router.navigate(['/dashboard/pacientes']);
    } else {
         this.router.navigate(['/dashboard/pacientes']);
    }
  }

} 