import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnamnesisService } from '../../../../services/anamnesis.service';
import { AnamnesisRequest, AnamnesisResponse } from '../../../../models/anamnesis.models';

@Component({
  selector: 'app-anamnesis-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="card">
      <h2>{{ esEdicion ? 'Editar Anamnesis' : 'Crear Anamnesis Inicial' }}</h2>

      <div *ngIf="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>

      <form [formGroup]="anamnesisForm" (ngSubmit)="guardarAnamnesis()">
        <!-- Campos de Datos Generales Adicionales -->
        <div class="form-field">
          <label for="gradoInstruccion">Grado de Instrucción</label>
          <input type="text" id="gradoInstruccion" formControlName="gradoInstruccion">
        </div>
        <div class="form-field">
          <label for="religion">Religión</label>
          <input type="text" id="religion" formControlName="religion">
        </div>
        <div class="form-field">
          <label for="estructuraFamiliar">Estructura Familiar</label>
          <textarea id="estructuraFamiliar" formControlName="estructuraFamiliar"></textarea>
        </div>
        <div class="form-field">
          <label for="informante">Informante</label>
          <input type="text" id="informante" formControlName="informante">
        </div>
        <div class="form-field">
          <label for="examinador">Examinador</label>
          <input type="text" id="examinador" formControlName="examinador">
        </div>
         <div class="form-field">
          <label for="fechaEntrevistaInicial">Fecha Entrevista Inicial</label>
          <input type="date" id="fechaEntrevistaInicial" formControlName="fechaEntrevistaInicial">
        </div>

        <hr class="my-4">

        <!-- Secciones Principales de la Anamnesis -->
        <div class="form-field">
          <label for="motivoConsulta">Motivo de Consulta <span class="required">*</span></label>
          <textarea id="motivoConsulta" formControlName="motivoConsulta" [class.error]="anamnesisForm.get('motivoConsulta')?.invalid && anamnesisForm.get('motivoConsulta')?.touched"></textarea>
           <div class="error-message" *ngIf="anamnesisForm.get('motivoConsulta')?.invalid && anamnesisForm.get('motivoConsulta')?.touched">
              El motivo de consulta es requerido.
           </div>
        </div>
        <div class="form-field">
          <label for="problemaActual">Problema Actual <span class="required">*</span></label>
          <textarea id="problemaActual" formControlName="problemaActual" [class.error]="anamnesisForm.get('problemaActual')?.invalid && anamnesisForm.get('problemaActual')?.touched"></textarea>
           <div class="error-message" *ngIf="anamnesisForm.get('problemaActual')?.invalid && anamnesisForm.get('problemaActual')?.touched">
              El problema actual es requerido.
           </div>
        </div>
        <div class="form-field">
          <label for="observacionConducta">Observación de Conducta</label>
          <textarea id="observacionConducta" formControlName="observacionConducta"></textarea>
        </div>

         <hr class="my-4">

        <!-- Historia Familiar -->
         <div class="form-field">
          <label for="historiaFamiliarMadre">Historia Familiar (Madre)</label>
          <textarea id="historiaFamiliarMadre" formControlName="historiaFamiliarMadre"></textarea>
        </div>
         <div class="form-field">
          <label for="historiaFamiliarPadre">Historia Familiar (Padre)</label>
          <textarea id="historiaFamiliarPadre" formControlName="historiaFamiliarPadre"></textarea>
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
       .error-alert {
        background-color: #fee2e2;
        border: 1px solid #ef4444;
        color: #b91c1c;
        padding: 0.75rem;
        border-radius: 0.375rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
      }
      .form-field {
        margin-bottom: 1rem;
      }
      .form-field label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
       .form-field input[type="text"],
       .form-field input[type="date"],
       .form-field textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
       .form-field textarea {
           min-height: 100px; /* Altura mínima para textareas */
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
       .my-4 {
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
      }
       .required {
           color: #ef4444;
       }
       .error {
        border-color: #ef4444 !important;
      }
      .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
    `
  ]
})
export class AnamnesisFormComponent implements OnInit {
  anamnesisForm: FormGroup;
  esEdicion = false;
  pacienteId: number | null = null;
  anamnesisId: number | null = null; // Para el caso de edición
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private anamnesisService: AnamnesisService
  ) {
    this.anamnesisForm = this.fb.group({
      gradoInstruccion: [''],
      religion: [''],
      estructuraFamiliar: [''],
      informante: [''],
      examinador: [''],
      fechaEntrevistaInicial: [''],
      motivoConsulta: ['', Validators.required],
      problemaActual: ['', Validators.required],
      observacionConducta: [''],
      historiaFamiliarMadre: [''],
      historiaFamiliarPadre: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const pacienteId = params.get('pacienteId');
      const anamnesisId = params.get('id'); // Si estamos editando, la ruta tendrá un ID de anamnesis

      if (pacienteId) {
        this.pacienteId = +pacienteId;

        if (anamnesisId) {
            this.esEdicion = true;
            this.anamnesisId = +anamnesisId;
            console.log('Modo edición: Anamnesis ID', this.anamnesisId, 'Paciente ID', this.pacienteId);
            this.loadAnamnesis(this.anamnesisId);
        } else {
            this.esEdicion = false;
            console.log('Modo creación: Paciente ID', this.pacienteId);
             // Al crear, si ya existe una anamnesis para este paciente, podríamos redirigir a edición o mostrar un mensaje
             // Por ahora, el backend maneja el error de duplicado.
        }

      } else {
        this.errorMessage = 'No se especificó un paciente para la anamnesis.';
      }
    });
  }

  loadAnamnesis(id: number) {
      this.anamnesisService.getAnamnesisByPacienteId(this.pacienteId!) // Usamos pacienteId aquí ya que la API es por paciente ID
         .subscribe({
             next: (anamnesis) => {
                 // La respuesta de la API GetAnamnesisByPacienteIdAsync devuelve la anamnesis con el ID, 
                 // por lo que podemos usar ese ID para la edición posterior si es necesario, 
                 // aunque la ruta de edición ya nos da el ID de la anamnesis.
                this.anamnesisId = anamnesis.id; 
                this.anamnesisForm.patchValue({
                    gradoInstruccion: anamnesis.gradoInstruccion,
                    religion: anamnesis.religion,
                    estructuraFamiliar: anamnesis.estructuraFamiliar,
                    informante: anamnesis.informante,
                    examinador: anamnesis.examinador,
                    fechaEntrevistaInicial: anamnesis.fechaEntrevistaInicial ? new Date(anamnesis.fechaEntrevistaInicial).toISOString().split('T')[0] : '',
                    motivoConsulta: anamnesis.motivoConsulta,
                    problemaActual: anamnesis.problemaActual,
                    observacionConducta: anamnesis.observacionConducta,
                    historiaFamiliarMadre: anamnesis.historiaFamiliarMadre,
                    historiaFamiliarPadre: anamnesis.historiaFamiliarPadre
                });
                console.log('Anamnesis cargada:', anamnesis);
             },
             error: (error) => {
                 console.error('Error al cargar anamnesis para edición:', error);
                 this.errorMessage = error.message;
                 // Si es un 404 y estamos en modo edición, significa que la anamnesis a editar no existe.
                 if(error.message.includes('404 Not Found')) {
                    this.errorMessage = 'La anamnesis que intenta editar no fue encontrada.';
                 }
             }
         });
  }

  guardarAnamnesis() {
    if (this.anamnesisForm.invalid) {
        this.marcarCamposComoTocados();
        this.errorMessage = 'Por favor, complete los campos requeridos.';
      return;
    }

     if (this.pacienteId === null) {
         this.errorMessage = 'No se puede guardar la anamnesis sin un paciente asociado.';
         return;
     }

    this.errorMessage = null;
    const formData: AnamnesisRequest = { ...this.anamnesisForm.value, pacienteId: this.pacienteId }; // Incluir pacienteId

    if (this.esEdicion && this.anamnesisId !== null) {
      // Lógica para actualizar anamnesis
      this.anamnesisService.updateAnamnesis(this.anamnesisId, formData)
        .subscribe({
          next: (response) => {
            console.log('Anamnesis actualizada con éxito', response);
            this.navigateToHistoriaClinicaIntegral(); // Navegar de regreso a la vista integral
          },
          error: (error) => {
            console.error('Error al actualizar anamnesis:', error);
            this.errorMessage = error.message;
          }
        });
    } else {
      // Lógica para crear nueva anamnesis
      this.anamnesisService.createAnamnesis(formData)
        .subscribe({
          next: (response) => {
            console.log('Anamnesis creada con éxito', response);
             this.navigateToHistoriaClinicaIntegral(); // Navegar de regreso a la vista integral
          },
          error: (error) => {
            console.error('Error al crear anamnesis:', error);
            this.errorMessage = error.message;
          }
        });
    }
  }

  private marcarCamposComoTocados() {
    Object.keys(this.anamnesisForm.controls).forEach(key => {
        const control = this.anamnesisForm.get(key);
        control?.markAsTouched();
      });
  }

  cancelar() {
    console.log('Formulario de anamnesis cancelado');
    this.navigateToHistoriaClinicaIntegral(); // Navegar de regreso a la vista integral
  }

  navigateToHistoriaClinicaIntegral() {
      if (this.pacienteId !== null) {
          this.router.navigate(['/dashboard/pacientes', this.pacienteId, 'historia-clinica']);
      } else {
          // Fallback si por alguna razón no tenemos el pacienteId
          this.router.navigate(['/dashboard/pacientes']);
      }
  }
} 