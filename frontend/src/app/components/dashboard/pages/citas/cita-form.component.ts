import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../../../../services/cita.service';
import { CitaRequest, CitaResponse } from '../../../../models/cita.models';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="card">
      <h3>{{ isEditing ? 'Editar Cita' : 'Nueva Cita' }}</h3>

      <div *ngIf="errorMessage" class="text-red-500 mt-4 mb-4">
        {{ errorMessage }}
      </div>

      <form [formGroup]="citaForm" (ngSubmit)="guardarCita()">
        <div class="form-field">
          <label for="fechaHora">Fecha y Hora</label>
          <input type="datetime-local" id="fechaHora" formControlName="fechaHora" [class.error]="citaForm.get('fechaHora')?.invalid && citaForm.get('fechaHora')?.touched">
          <div *ngIf="citaForm.get('fechaHora')?.invalid && citaForm.get('fechaHora')?.touched" class="text-red-500 text-sm mt-1">
            La fecha y hora son requeridas.
          </div>
        </div>

        <div class="form-field">
          <label for="motivo">Motivo (Opcional)</label>
          <textarea id="motivo" formControlName="motivo" rows="3"></textarea>
        </div>

        <div class="form-field">
          <label for="estado">Estado</label>
          <select id="estado" formControlName="estado" [class.error]="citaForm.get('estado')?.invalid && citaForm.get('estado')?.touched">
            <option value="">Seleccione un estado</option>
            <option value="programada">Programada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <div *ngIf="citaForm.get('estado')?.invalid && citaForm.get('estado')?.touched" class="text-red-500 text-sm mt-1">
            El estado es requerido.
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button type="button" (click)="cancelar()" class="btn btn-secondary mr-2">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="citaForm.invalid || pacienteId === null">Guardar</button>
        </div>
      </form>
    </div>
  `,
   styles: [
    `
      /* Estilos generales de tarjeta y formulario */
      .card {
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 600px; /* Limitar ancho del formulario */
        margin: 2rem auto; /* Centrar el formulario */
      }
       h3 {
        font-size: 1.5rem; /* Tamaño del título */
        font-weight: 600;
        color: #333;
        margin-bottom: 1.5rem;
        text-align: center;
      }
      .form-field {
        margin-bottom: 1.5rem;
      }
      .form-field label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #555;
      }
      .form-field input[type="datetime-local"],
      .form-field textarea,
      .form-field select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        box-sizing: border-box; /* Incluir padding y border en el ancho total */
      }
       .form-field input[type="datetime-local"].error,
       .form-field select.error {
           border-color: #ef4444; /* Color rojo para bordes con error */
       }
      .text-red-500 {
        color: #ef4444; /* Color rojo */
      }
      .text-sm {
        font-size: 0.875rem; /* 14px */
      }
      .mt-1 {
        margin-top: 0.25rem; /* 4px */
      }
       .mb-4 {
        margin-bottom: 1rem;
      }
      .flex {
        display: flex;
      }
      .justify-end {
        justify-content: flex-end;
      }
      .mt-6 {
        margin-top: 1.5rem; /* 24px */
      }
      .btn {
        padding: 0.75rem 1.5rem; /* Ajustar padding del botón */
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.2s ease;
      }
      .btn-primary {
        background-color: #4f46e5;
        color: white;
        border: none;
      }
      .btn-primary:hover:not(:disabled) {
        background-color: #4338ca;
      }
      .btn-primary:disabled {
           opacity: 0.5;
           cursor: not-allowed;
      }
      .btn-secondary {
        background-color: #e2e8f0; /* Gris claro */
        color: #334155; /* Gris oscuro */
        border: 1px solid #cbd5e0;
      }
      .btn-secondary:hover {
        background-color: #cbd5e0;
      }
       .mr-2 {
           margin-right: 0.5rem;
       }
    `
  ]
})
export class CitaFormComponent implements OnInit {
  citaForm: FormGroup;
  pacienteId: number | null = null;
  citaId: number | null = null;
  isEditing = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private citaService: CitaService
  ) {
    this.citaForm = this.fb.group({
      fechaHora: ['', Validators.required],
      motivo: [''],
      estado: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('CitaFormComponent ngOnInit');
    // Obtener pacienteId de la ruta
    // Intentar primero desde el snapshot (síncrono)
    let currentRoute = this.route.snapshot;
    while (currentRoute) {
        console.log('Checking route snapshot segment:', currentRoute.url.map(s => s.path).join('/'));
        if (currentRoute.paramMap.has('pacienteId')) {
            this.pacienteId = +currentRoute.paramMap.get('pacienteId')!;
            console.log('PacienteId encontrado en snapshot:', this.pacienteId);
            break;
        }
        currentRoute = currentRoute.parent!;
    }

    // Si no se encontró en el snapshot, suscribirse a paramMap (asíncrono) como fallback para cambios de ruta
    if (this.pacienteId === null) {
         console.log('PacienteId no encontrado en snapshot, suscribiendo a paramMap...');
         this.route.paramMap.subscribe(params => {
            const pacienteIdParam = params.get('pacienteId');
            if (pacienteIdParam) {
              this.pacienteId = +pacienteIdParam; // Convertir a número
              console.log('PacienteId obtenido de paramMap:', this.pacienteId);
            } else {
                console.log('paramMap no contiene pacienteId');
            }
          });

         // También suscribirse al paramMap del padre si la estructura de ruta lo requiere
         this.route.parent?.paramMap.subscribe(params => {
            const pacienteIdParam = params.get('pacienteId');
            if (pacienteIdParam) {
                 if (this.pacienteId === null) { // Solo actualizar si aún no lo tenemos
                     this.pacienteId = +pacienteIdParam; // Convertir a número
                     console.log('PacienteId obtenido de parent paramMap:', this.pacienteId);
                 }
            }
         });

        // Y al paramMap del padre del padre (originalmente solo teniamos este)
         this.route.parent?.parent?.paramMap.subscribe(params => {
            const pacienteIdParam = params.get('pacienteId');
            if (pacienteIdParam) {
                 if (this.pacienteId === null) { // Solo actualizar si aún no lo tenemos
                     this.pacienteId = +pacienteIdParam; // Convertir a número
                     console.log('PacienteId obtenido de parent.parent paramMap:', this.pacienteId);
                 }
            }
         });

    }

    // Verificar si estamos editando (si hay un citaId en la ruta actual)
    this.route.paramMap.subscribe(params => {
      const citaIdParam = params.get('citaId');
      if (citaIdParam) {
        this.citaId = +citaIdParam;
        this.isEditing = true;
        console.log('Editando cita con ID:', this.citaId);
        this.cargarCita(this.citaId);
      } else {
          console.log('Creando nueva cita (no hay citaId)');
      }
    });
  }

  cargarCita(id: number): void {
    this.citaService.getCitaById(id).pipe(
      tap(cita => {
        // Formatear la fecha y hora al formato local adecuado para input type="datetime-local"
        // El backend devuelve UTC, necesitamos convertir a la hora local del usuario si es necesario, 
        // pero para la visualización directa, formatear la cadena ISO suele funcionar en navegadores modernos.
        // Si el backend devuelve un string ISO 8601, debería funcionar directamente.
        const fechaHoraLocal = cita.fechaHora ? new Date(cita.fechaHora).toISOString().slice(0, 16) : '';

        this.citaForm.patchValue({
          fechaHora: fechaHoraLocal,
          motivo: cita.motivo,
          estado: cita.estado
        });
      }),
      catchError(error => {
        console.error('Error al cargar cita:', error);
        this.errorMessage = 'Error al cargar la cita para edición.';
         if (error.error && error.error.message) {
             this.errorMessage = 'Error: ' + error.error.message;
        }
        return of(null); // Continúa el observable, pero con null
      })
    ).subscribe(); // Suscribirse para ejecutar la llamada API
  }

  guardarCita(): void {
    console.log('guardarCita() llamado');
    console.log('Estado del formulario:', this.citaForm.invalid, 'PacienteId:', this.pacienteId);
    if (this.citaForm.invalid || this.pacienteId === null) {
      console.log('Formulario inválido o pacienteId es null');
      this.marcarCamposComoTocados();
      return;
    }

    console.log('Formulario válido, pacienteId: ', this.pacienteId);
    const formValues = this.citaForm.value;

    // Construir el objeto de solicitud
    const citaRequest: CitaRequest = {
      pacienteId: this.pacienteId,
      fechaHora: formValues.fechaHora, // El backend espera DateTime, Angular lo envía como string ISO 8601
      motivo: formValues.motivo,
      estado: formValues.estado
    };

    console.log('Enviando solicitud:', citaRequest);

    if (this.isEditing && this.citaId !== null) {
      // Actualizar cita existente
      this.citaService.updateCita(this.citaId, citaRequest).subscribe({
        next: (response) => {
          console.log('Cita actualizada con éxito', response);
          this.navegarAListaCitas();
        },
        error: (error) => {
          console.error('Error al actualizar cita:', error);
          this.errorMessage = 'Error al actualizar la cita.';
          if (error.error && error.error.message) {
            this.errorMessage = 'Error: ' + error.error.message;
          }
        }
      });
    } else {
      // Crear nueva cita
      this.citaService.createCita(citaRequest).subscribe({
        next: (response) => {
          console.log('Cita creada con éxito', response);
          this.navegarAListaCitas();
        },
        error: (error) => {
          console.error('Error al crear cita:', error);
          this.errorMessage = 'Error al crear la cita.';
          if (error.error && error.error.message) {
            this.errorMessage = 'Error: ' + error.error.message;
          }
        }
      });
    }
  }

   navegarAListaCitas(): void {
        if (this.pacienteId !== null) {
             // Navegar de regreso a la vista integral o a la lista de citas si existe una ruta dedicada
            // Asumiendo una ruta como /dashboard/pacientes/:pacienteId/citas
            this.router.navigate(['/dashboard/pacientes', this.pacienteId, 'citas']);
        }
    }

  cancelar(): void {
     this.navegarAListaCitas();
  }

  private marcarCamposComoTocados(): void {
    Object.values(this.citaForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
} 