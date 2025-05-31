import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoriaClinicaService } from '../../../../services/historia-clinica.service';
import { HistoriaClinicaResponse, HistoriasClinicasResponse } from '../../../../models/historia-clinica.models';

@Component({
  selector: 'app-historia-clinica-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2>Historial Clínico del Paciente (Notas de Progreso)</h2>
        <button *ngIf="pacienteId !== null" (click)="crearHistoriaClinica()" class="btn btn-primary">Nueva Notas de Progreso</button>
      </div>

      <div *ngIf="historiasClinicas.length === 0">
        <p>No hay historias clínicas registradas para este paciente.</p>
      </div>

      <div *ngIf="historiasClinicas.length > 0">
        <table class="table w-full">
          <thead>
            <tr>
              <th class="text-left">Fecha de Consulta</th>
              <th class="text-left">Resumen</th>
              <th class="text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let historia of historiasClinicas">
              <td>{{ historia.fechaConsulta | date:'dd/MM/yyyy' }}</td>
              <td>{{ historia.subjetivo.substring(0, 100) + '...' }}</td>
              <td>
                <button (click)="verDetalle(historia.id)" class="btn-link">Ver Detalle</button>
                <button (click)="editarHistoriaClinica(historia.id)" class="btn-link ml-2">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
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
      .btn {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 1rem;
      }
      .btn-primary {
        background-color: #4f46e5;
        color: white;
        border: none;
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
      }
      .btn-link:hover {
        color: #4338ca;
      }
    `
  ]
})
export class HistoriaClinicaListComponent implements OnInit {

  pacienteId: number | null = null;
  historiasClinicas: HistoriaClinicaResponse[] = [];
  paginaActual = 1;
  itemsPorPagina = 10; // Puedes ajustar esto según tu necesidad
  totalItems = 0;
  totalPaginas = 1;

  constructor(
    private route: ActivatedRoute,
    private historiaClinicaService: HistoriaClinicaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.pacienteId = +id; // Convertir el ID a número
        console.log('ID del paciente obtenido:', this.pacienteId);
        this.cargarHistoriasClinicas(); // Cargar historias clínicas después de obtener el ID
      }
    });
  }

  cargarHistoriasClinicas() {
    if (this.pacienteId !== null) {
      this.historiaClinicaService.getHistoriasClinicasByPaciente(this.pacienteId, this.paginaActual, this.itemsPorPagina)
        .subscribe({
          next: (response) => {
            this.historiasClinicas = response.data;
            this.totalItems = response.total;
            this.totalPaginas = Math.ceil(this.totalItems / this.itemsPorPagina);
            console.log('Historias clínicas cargadas:', this.historiasClinicas);
          },
          error: (error) => {
            console.error('Error al cargar historias clínicas:', error);
          }
        });
    }
  }

  crearHistoriaClinica() {
    if (this.pacienteId !== null) {
      console.log('Navegando para crear nueva historia clínica para el paciente con ID:', this.pacienteId);
      this.router.navigate(['/dashboard/pacientes', this.pacienteId, 'historias-clinicas', 'nueva']);
    }
  }

  verDetalle(historiaId: number) {
    console.log('Navegando para ver detalle de historia clínica con ID:', historiaId);
    this.router.navigate(['/dashboard/historias-clinicas', historiaId]);
  }

  editarHistoriaClinica(historiaId: number) {
    console.log('Navegando para editar historia clínica con ID:', historiaId);
    this.router.navigate(['/dashboard/historias-clinicas', historiaId, 'editar']);
  }

  // Puedes añadir métodos para paginación si es necesario
  cambiarPagina(pagina: number) {
      if (pagina >= 1 && pagina <= this.totalPaginas) {
          this.paginaActual = pagina;
          this.cargarHistoriasClinicas();
      }
  }

} 