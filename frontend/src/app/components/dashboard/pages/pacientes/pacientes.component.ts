import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Paciente, PacienteRequest, PacientesResponse } from '../../../../models/paciente.models';
import { PacienteService } from '../../../../services/paciente.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pacientes',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
    template: `
        <div class="card pacientes-main">
            <div class="pacientes-header">
                <h2>Pacientes</h2>
                <button (click)="abrirModalNuevoPaciente()" class="btn pacientes-btn-nuevo">Nuevo Paciente</button>
            </div>

            <div *ngIf="errorMessage" class="error-alert">
                {{ errorMessage }}
            </div>

            <!-- Tabla de Pacientes -->
            <div class="pacientes-table-wrap">
                <table class="table pacientes-table">
                      <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Última Consulta</th>
                            <th>Estado</th>
                             <th>Notas de Progreso</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let paciente of pacientes">
                            <td>
                                <div class="pacientes-nombre">{{ paciente.nombreCompleto }}</div>
                                <div class="pacientes-correo">{{ paciente.correo }}</div>
                            </td>
                            <td>{{ calcularEdad(paciente.fechaNacimiento) }} años</td>
                            <td>{{ paciente.ultimaConsulta ? (paciente.ultimaConsulta | date:'dd/MM/yyyy') : 'Sin consultas' }}</td>
                            <td>
                                <span class="status-badge" [ngClass]="paciente.estado === 'activo' ? 'success' : 'error'">
                                    {{ paciente.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                                </span>
                            </td>
                            <td>
                                <button (click)="verHistoriasClinicas(paciente.id)" class="pacientes-btn-link">Notas de Progreso</button>
                                <button (click)="verHistoriaClinicaIntegral(paciente.id)" class="pacientes-btn-link">Historia Clínica Integral</button>
                            </td>
                            <td>
                                <button [routerLink]="['/', 'dashboard', 'pacientes', paciente.id, 'citas']" class="pacientes-btn-link">Ver Citas</button>
                            </td>
                        </tr>
                        <tr *ngIf="pacientes.length === 0">
                            <td colspan="6" class="pacientes-vacio">No hay pacientes registrados</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Paginación -->
            <div class="pacientes-paginacion">
                <button (click)="cambiarPagina(paginaActual - 1)" [disabled]="paginaActual === 1" class="btn pacientes-btn-pag">Anterior</button>
                <span class="pacientes-pag-info">
                    Mostrando {{ (paginaActual - 1) * itemsPorPagina + 1 }} a {{ Math.min(paginaActual * itemsPorPagina, totalItems) }} de {{ totalItems }} resultados
                </span>
                <button (click)="cambiarPagina(paginaActual + 1)" [disabled]="paginaActual === totalPaginas" class="btn pacientes-btn-pag">Siguiente</button>
            </div>
        </div>
        <!-- Modal de Paciente -->
        <div *ngIf="mostrarModal" class="pacientes-modal-bg">
            <div class="pacientes-modal">
                <form [formGroup]="pacienteForm" (ngSubmit)="guardarPaciente()">
                    <h3>{{ pacienteSeleccionado ? 'Editar Paciente' : 'Nuevo Paciente' }}</h3>

                    <div *ngIf="errorMessage" class="error-alert">
                        {{ errorMessage }}
                    </div>

                    <div class="pacientes-modal-fields">
                        <div class="pacientes-modal-field">
                            <label for="nombreCompleto">Nombre Completo</label>
                            <input type="text" id="nombreCompleto" formControlName="nombreCompleto" [class.error]="pacienteForm.get('nombreCompleto')?.invalid && pacienteForm.get('nombreCompleto')?.touched">
                            <div class="error-message" *ngIf="pacienteForm.get('nombreCompleto')?.invalid && pacienteForm.get('nombreCompleto')?.touched">
                                El nombre completo es requerido
                            </div>
                        </div>
                        <div class="pacientes-modal-field">
                            <label for="fechaNacimiento">Fecha de Nacimiento</label>
                            <input type="date" id="fechaNacimiento" formControlName="fechaNacimiento" [class.error]="pacienteForm.get('fechaNacimiento')?.invalid && pacienteForm.get('fechaNacimiento')?.touched">
                            <div class="error-message" *ngIf="pacienteForm.get('fechaNacimiento')?.invalid && pacienteForm.get('fechaNacimiento')?.touched">
                                La fecha de nacimiento es requerida
                            </div>
                        </div>
                        <div class="pacientes-modal-field">
                            <label for="genero">Género</label>
                            <select id="genero" formControlName="genero" [class.error]="pacienteForm.get('genero')?.invalid && pacienteForm.get('genero')?.touched">
                                <option value="">Seleccione...</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Otro</option>
                            </select>
                            <div class="error-message" *ngIf="pacienteForm.get('genero')?.invalid && pacienteForm.get('genero')?.touched">
                                El género es requerido
                            </div>
                        </div>
                        <div class="pacientes-modal-field">
                            <label for="direccion">Dirección</label>
                            <input type="text" id="direccion" formControlName="direccion" [class.error]="pacienteForm.get('direccion')?.invalid && pacienteForm.get('direccion')?.touched">
                            <div class="error-message" *ngIf="pacienteForm.get('direccion')?.invalid && pacienteForm.get('direccion')?.touched">
                                La dirección es requerida
                            </div>
                        </div>
                        <div class="pacientes-modal-field">
                            <label for="telefono">Teléfono</label>
                            <input type="tel" id="telefono" formControlName="telefono" [class.error]="pacienteForm.get('telefono')?.invalid && pacienteForm.get('telefono')?.touched">
                            <div class="error-message" *ngIf="pacienteForm.get('telefono')?.invalid && pacienteForm.get('telefono')?.touched">
                                El teléfono es requerido
                            </div>
                        </div>
                        <div class="pacientes-modal-field">
                            <label for="correo">Correo Electrónico</label>
                            <input type="email" id="correo" formControlName="correo" [class.error]="pacienteForm.get('correo')?.invalid && pacienteForm.get('correo')?.touched">
                            <div class="error-message" *ngIf="pacienteForm.get('correo')?.invalid && pacienteForm.get('correo')?.touched">
                                <span *ngIf="pacienteForm.get('correo')?.errors?.['required']">El correo es requerido</span>
                                <span *ngIf="pacienteForm.get('correo')?.errors?.['email']">El correo no es válido</span>
                            </div>
                        </div>
                        <div class="pacientes-modal-field">
                            <label for="ocupacion">Ocupación</label>
                            <input type="text" id="ocupacion" formControlName="ocupacion" [class.error]="pacienteForm.get('ocupacion')?.invalid && pacienteForm.get('ocupacion')?.touched">
                            <div class="error-message" *ngIf="pacienteForm.get('ocupacion')?.invalid && pacienteForm.get('ocupacion')?.touched">
                                La ocupación es requerida
                            </div>
                        </div>
                        <div class="pacientes-modal-field">
                            <label for="estadoCivil">Estado Civil</label>
                            <select id="estadoCivil" formControlName="estadoCivil" [class.error]="pacienteForm.get('estadoCivil')?.invalid && pacienteForm.get('estadoCivil')?.touched">
                                <option value="">Seleccione...</option>
                                <option value="soltero">Soltero(a)</option>
                                <option value="casado">Casado(a)</option>
                                <option value="divorciado">Divorciado(a)</option>
                                <option value="viudo">Viudo(a)</option>
                            </select>
                            <div class="error-message" *ngIf="pacienteForm.get('estadoCivil')?.invalid && pacienteForm.get('estadoCivil')?.touched">
                                El estado civil es requerido
                            </div>
                        </div>
                    </div>
                    <div class="pacientes-modal-actions">
                        <button type="submit" class="btn">Guardar</button>
                        <button type="button" (click)="cerrarModal()" class="btn pacientes-btn-cancelar">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `,
    styles: [`
        .pacientes-main {
            padding: 2.5rem 2rem 2rem 2rem;
        }
        .pacientes-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
        }
        .pacientes-btn-nuevo {
            font-size: 1rem;
            padding: 0.5rem 1.2rem;
        }
        .pacientes-table-wrap {
            overflow-x: auto;
        }
        .pacientes-nombre {
            font-weight: 600;
            color: #22223b;
        }
        .pacientes-correo {
            color: #666;
            font-size: 0.97rem;
        }
        .pacientes-vacio {
            text-align: center;
            color: #888;
            font-size: 1rem;
        }
        .pacientes-btn-link {
            background: none;
            border: none;
            color: #667eea;
            font-weight: 500;
            cursor: pointer;
            margin-right: 0.7rem;
            font-size: 1rem;
            transition: color 0.2s;
        }
        .pacientes-btn-link:hover {
            color: #4c51bf;
            text-decoration: underline;
        }
        .pacientes-btn-link-danger {
            color: #e53e3e;
        }
        .pacientes-btn-link-danger:hover {
            color: #b91c1c;
        }
        .pacientes-paginacion {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1.2rem;
            margin-top: 2rem;
        }
        .pacientes-btn-pag {
            font-size: 1rem;
            padding: 0.4rem 1.1rem;
        }
        .pacientes-pag-info {
            font-size: 1rem;
            color: #666;
        }
        /* Modal */
        .pacientes-modal-bg {
            position: fixed;
            z-index: 1000;
            inset: 0;
            background: rgba(44, 62, 80, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .pacientes-modal {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(44, 62, 80, 0.18);
            padding: 2rem 2rem;
            max-width: 600px;
            width: 90%;
        }
        .pacientes-modal h3 {
            font-size: 1.3rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 1.2rem;
            text-align: center;
        }
        .pacientes-modal-fields {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        .pacientes-modal-field label {
            font-size: 0.97rem;
            color: #444;
            margin-bottom: 0.2rem;
            display: block;
        }
        .pacientes-modal-field input,
        .pacientes-modal-field select {
            width: 100%;
            padding: 0.6rem 0.8rem;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 1rem;
            outline: none;
            transition: border 0.2s;
        }
        .pacientes-modal-field input:focus,
        .pacientes-modal-field select:focus {
            border-color: #667eea;
        }
        .pacientes-modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        .pacientes-btn-cancelar {
            background: #e2e8f0;
            color: #333;
        }
        .pacientes-btn-cancelar:hover {
            background: #cbd5e1;
        }
        @media (max-width: 700px) {
            .pacientes-main, .pacientes-modal {
                padding: 1rem 0.5rem;
            }
            .pacientes-modal {
                max-width: 98vw;
            }
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
    `]
})
export class PacientesComponent implements OnInit {
    pacientes: Paciente[] = [];
    pacienteForm: FormGroup;
    mostrarModal = false;
    pacienteSeleccionado: Paciente | null = null;
    paginaActual = 1;
    itemsPorPagina = 10;
    totalItems = 0;
    totalPaginas = 1;
    Math = Math;
    errorMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private pacienteService: PacienteService,
        private router: Router
    ) {
        this.pacienteForm = this.fb.group({
            nombreCompleto: ['', [Validators.required]],
            fechaNacimiento: ['', [Validators.required]],
            genero: ['', [Validators.required]],
            direccion: ['', [Validators.required]],
            telefono: ['', [Validators.required]],
            correo: ['', [Validators.required, Validators.email]],
            ocupacion: ['', [Validators.required]],
            estadoCivil: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.cargarPacientes();
    }

    cargarPacientes() {
        this.errorMessage = null;
        this.pacienteService.getPacientes(this.paginaActual, this.itemsPorPagina)
            .subscribe({
                next: (response) => {
                    this.pacientes = response.data;
                    this.totalItems = response.total;
                    this.totalPaginas = Math.ceil(this.totalItems / this.itemsPorPagina);
                },
                error: (error) => {
                    console.error('Error al cargar pacientes:', error);
                    this.errorMessage = error.message;
                }
            });
    }

    cambiarPagina(pagina: number) {
        if (pagina >= 1 && pagina <= this.totalPaginas) {
            this.paginaActual = pagina;
            this.cargarPacientes();
        }
    }

    abrirModalNuevoPaciente() {
        this.pacienteSeleccionado = null;
        this.pacienteForm.reset();
        this.mostrarModal = true;
    }

    editarPaciente(paciente: Paciente) {
        this.pacienteSeleccionado = paciente;
        this.pacienteForm.patchValue({
            nombreCompleto: paciente.nombreCompleto,
            fechaNacimiento: this.formatearFecha(paciente.fechaNacimiento),
            genero: paciente.genero,
            direccion: paciente.direccion,
            telefono: paciente.telefono,
            correo: paciente.correo,
            ocupacion: paciente.ocupacion,
            estadoCivil: paciente.estadoCivil
        });
        this.mostrarModal = true;
    }

    cerrarModal() {
        this.mostrarModal = false;
        this.pacienteSeleccionado = null;
        this.pacienteForm.reset();
    }

    guardarPaciente() {
        if (this.pacienteForm.invalid) {
            this.marcarCamposComoTocados();
            return;
        }

        this.errorMessage = null;
        const pacienteData: PacienteRequest = this.pacienteForm.value;

        if (this.pacienteSeleccionado) {
            this.pacienteService.actualizarPaciente(this.pacienteSeleccionado.id, pacienteData)
                .subscribe({
                    next: (response) => {
                        console.log('Paciente actualizado con éxito', response);
                        this.cargarPacientes();
                        this.cerrarModal();
                    },
                    error: (error) => {
                        console.error('Error al actualizar paciente:', error);
                        this.errorMessage = error.message;
                    }
                });
        } else {
            this.pacienteService.crearPaciente(pacienteData)
                .subscribe({
                    next: (response) => {
                        console.log('Paciente creado con éxito', response);
                        this.cargarPacientes();
                        this.cerrarModal();
                    },
                    error: (error) => {
                        console.error('Error al crear paciente:', error);
                        this.errorMessage = error.message;
                    }
                });
        }
    }

    eliminarPaciente(id: number) {
        if (confirm('¿Está seguro de eliminar este paciente?')) {
            this.errorMessage = null;
            this.pacienteService.eliminarPaciente(id)
                .subscribe({
                    next: () => {
                        this.cargarPacientes();
                    },
                    error: (error) => {
                        console.error('Error al eliminar paciente:', error);
                        this.errorMessage = error.message;
                    }
                });
        }
    }

    private marcarCamposComoTocados() {
        Object.keys(this.pacienteForm.controls).forEach(key => {
            const control = this.pacienteForm.get(key);
            control?.markAsTouched();
        });
    }

    calcularEdad(fechaNacimiento: Date): number {
        const hoy = new Date();
        const fechaNac = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        
        return edad;
    }

    formatearFecha(fecha: Date): string {
        return new Date(fecha).toISOString().split('T')[0];
    }

    verHistoriasClinicas(pacienteId: number) {
        this.router.navigate(['/dashboard/pacientes', pacienteId, 'historias-clinicas']);
    }

    verHistoriaClinicaIntegral(pacienteId: number) {
        this.router.navigate(['/dashboard/pacientes', pacienteId, 'historia-clinica']);
    }
} 