import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AnamnesisResponse } from '../../../../models/anamnesis.models';
import { HistoriaClinicaResponse } from '../../../../models/historia-clinica.models';
import { AnamnesisService } from '../../../../services/anamnesis.service';
import { HistoriaClinicaService } from '../../../../services/historia-clinica.service';
import { catchError, forkJoin, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-historia-clinica-integral-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Importar RouterModule para usar routerLink
  ],
  template: `
    <div class="card">
      <h2>Historia Clínica Integral de {{ pacienteNombre }}</h2>

      <div *ngIf="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>

      <!-- Botón de Descarga de PDF -->
      <div class="action-buttons mb-4">
        <button (click)="downloadPdf()" class="btn btn-secondary" [disabled]="!pacienteId">Descargar Historia Clínica PDF</button>
      </div>

      <!-- Sección de Anamnesis -->
      <div class="anamnesis-section mb-4">
        <h3>Anamnesis Inicial</h3>
        <div *ngIf="anamnesis; else noAnamnesis">
          <p><strong>Grado de Instrucción:</strong> {{ anamnesis.gradoInstruccion }}</p>
          <p><strong>Religión:</strong> {{ anamnesis.religion }}</p>
          <p><strong>Estructura Familiar:</strong> {{ anamnesis.estructuraFamiliar }}</p>
          <p><strong>Informante:</strong> {{ anamnesis.informante }}</p>
          <p><strong>Examinador:</strong> {{ anamnesis.examinador }}</p>
          <p><strong>Fecha Entrevista Inicial:</strong> {{ anamnesis.fechaEntrevistaInicial | date:'dd/MM/yyyy' }}</p>
          <p><strong>Motivo de Consulta:</strong> {{ anamnesis.motivoConsulta }}</p>
          <p><strong>Problema Actual:</strong> {{ anamnesis.problemaActual }}</p>
          <p><strong>Observación de Conducta:</strong> {{ anamnesis.observacionConducta }}</p>
          <p><strong>Historia Familiar (Madre):</strong> {{ anamnesis.historiaFamiliarMadre }}</p>
          <p><strong>Historia Familiar (Padre):</strong> {{ anamnesis.historiaFamiliarPadre }}</p>
          <div class="mt-3">
            <button *ngIf="anamnesis" [routerLink]="['/dashboard/pacientes', pacienteId, 'historia-clinica', 'anamnesis', anamnesis.id, 'editar']" class="btn btn-secondary">Editar Anamnesis</button>
          </div>
        </div>
        <ng-template #noAnamnesis>
          <p>No hay información de anamnesis inicial registrada para este paciente.</p>
           <div class="mt-3">
              <button [routerLink]="['crear-anamnesis']" class="btn btn-primary">Crear Anamnesis Inicial</button>
           </div>
        </ng-template>
      </div>

      <hr class="my-4">

      <!-- Sección de Notas de Progreso (Historias Clínicas) -->
      <div class="notas-progreso-section">
        <h3>Notas de Progreso (Sesiones)</h3>

        <div *ngIf="historiasClinicas.length > 0; else noHistoriasClinicas">
          <table class="table w-full">
            <thead>
              <tr>
                <th class="text-left">Fecha de Consulta</th>
                <th class="text-left">Resumen (Subjetivo)</th>
                <th class="text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let historia of historiasClinicas">
                <td>{{ historia.fechaConsulta | date:'dd/MM/yyyy' }}</td>
                <td>{{ historia.subjetivo.substring(0, 100) + (historia.subjetivo.length > 100 ? '...' : '') }}</td>
                <td>
                  <button [routerLink]="['/dashboard/historias-clinicas', historia.id]" class="btn-link">Ver Detalle</button>
                   <!-- El enlace de edición de historia clínica ya existe en la lista de historias clínicas, podemos replicarlo si queremos aquí -->
                   <!-- <button [routerLink]="['historias-clinicas', historia.id, 'editar']" class="btn-link ml-2">Editar</button> -->
                </td>
              </tr>
            </tbody>
          </table>
           <!-- TODO: Implementar paginación si la lista de historias clínicas es muy larga -->
        </div>
        <ng-template #noHistoriasClinicas>
          <p>No hay notas de progreso registradas para este paciente.</p>
        </ng-template>

         <div class="mt-3">
            <button [routerLink]="['/dashboard/pacientes', pacienteId, 'historias-clinicas', 'nueva']" class="btn btn-primary">Registrar Nueva Nota de Progreso</button>
         </div>

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
      .error-alert {
        background-color: #fee2e2;
        border: 1px solid #ef4444;
        color: #b91c1c;
        padding: 0.75rem;
        border-radius: 0.375rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
      }
      .anamnesis-section h3,
      .notas-progreso-section h3 {
        color: #333;
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }
      .anamnesis-section p,
      .notas-progreso-section p {
        margin-bottom: 0.5rem;
        color: #555;
      }
      .mb-4 {
        margin-bottom: 1.5rem;
      }
      .my-4 {
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
      }
      .mt-3 {
          margin-top: 1rem;
      }
      .btn {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 1rem;
        margin-right: 0.5rem; /* Espacio entre botones */
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
       .btn-link {
        background: none;
        border: none;
        color: #4f46e5;
        cursor: pointer;
        text-decoration: underline;
        padding: 0;
        margin-right: 0.5rem; /* Espacio entre enlaces */
      }
      .btn-link:hover {
        color: #4338ca;
      }
       .w-full {
           width: 100%;
       }
       .table {
          border-collapse: collapse;
          width: 100%;
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
    `
  ]
})
export class HistoriaClinicaIntegralViewComponent implements OnInit {
  pacienteId: number | null = null;
  pacienteNombre: string = 'Paciente'; // Placeholder
  anamnesis: AnamnesisResponse | null = null;
  historiasClinicas: HistoriaClinicaResponse[] = [];
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private anamnesisService: AnamnesisService,
    private historiaClinicaService: HistoriaClinicaService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('pacienteId');
      if (id) {
        this.pacienteId = +id; // Convertir a número
        this.loadHistoriaClinicaIntegral();
      } else {
        this.errorMessage = 'No se especificó un paciente.';
      }
    });
  }

  loadHistoriaClinicaIntegral() {
    if (this.pacienteId === null) return;

    this.errorMessage = null;

    // Cargar Anamnesis y Historias Clínicas en paralelo
    forkJoin([
      this.anamnesisService.getAnamnesisByPacienteId(this.pacienteId).pipe(
          catchError(error => {
              // Si no hay anamnesis (404), no es un error fatal, solo significa que no existe
              if (error.message.includes('404 Not Found')) {
                  console.warn(`No se encontró anamnesis para el paciente ${this.pacienteId}.`);
                  return of(null); // Devolver null para indicar que no hay anamnesis
              } else {
                  console.error('Error al cargar anamnesis:', error);
                  this.errorMessage = 'Error al cargar la anamnesis.';
                  return throwError(() => error); // Re-lanzar otros errores
              }
          })
      ),
      this.historiaClinicaService.getHistoriasClinicasByPaciente(this.pacienteId)
          .pipe( // Añadir paginación y manejo de errores si es necesario
              catchError(error => {
                  console.error('Error al cargar historias clínicas:', error);
                  this.errorMessage = 'Error al cargar las historias clínicas.'; // Podría ser más específico si el de anamnesis ya puso un error
                  return throwError(() => error); // Re-lanzar el error
              })
          )
    ]).subscribe({
      next: ([anamnesisResponse, historiasClinicasResponse]) => {
        this.anamnesis = anamnesisResponse; // Puede ser null si no existe
        this.historiasClinicas = historiasClinicasResponse.data; // Asumiendo que response.data es el array de historias clínicas

         // Intentar obtener el nombre del paciente si la anamnesis existe, de lo contrario, cargar el paciente por separado si es necesario
         if(this.anamnesis && this.anamnesis.pacienteNombreCompleto) {
             this.pacienteNombre = this.anamnesis.pacienteNombreCompleto;
         } else { // Si no hay anamnesis o nombre en la respuesta, cargar el paciente para obtener el nombre
             // TODO: Implementar un método getPaciente en PacienteService si aún no existe y usarlo aquí
             // Por ahora, si no hay anamnesis, el nombre será 'Paciente'
         }

      },
      error: (error) => {
        // El manejo de errores ya se hizo en los pipes individuales
        console.error('Error en forkJoin:', error);
        // El errorMessage ya debería estar seteado por los catchError individuales
      }
    });
  }

   // Métodos de navegación (se implementarán mejor con rutas hijas después)
   crearAnamnesis() {
     this.router.navigate(['crear-anamnesis'], { relativeTo: this.route });
   }

    editarAnamnesis() {
      if (this.anamnesis) {
         this.router.navigate(['editar-anamnesis'], { relativeTo: this.route });
      }
    }

   crearNotaProgreso() {
      this.router.navigate(['historias-clinicas', 'nueva'], { relativeTo: this.route });
   }

    verDetalleHistoria(historiaId: number) {
       this.router.navigate(['historias-clinicas', historiaId], { relativeTo: this.route });
    }

    downloadPdf() {
        if (this.pacienteId === null) {
          console.error('No hay ID de paciente para descargar el PDF.');
          return;
        }
      
        // Construir la URL del endpoint del backend
        const pdfUrl = `/api/HistoriaClinica/paciente/${this.pacienteId}/pdf`;
      
        // Realizar la solicitud GET al backend y esperar un blob (el archivo PDF)
        this.http.get(pdfUrl, { responseType: 'blob' }).subscribe({
          next: (responseBlob) => {
            // Crear un objeto URL a partir del blob
            const blob = new Blob([responseBlob], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
      
            // Generar nombre de archivo más descriptivo
            const fechaActual = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
            const nombrePaciente = this.pacienteNombre || 'Paciente';
            const nombreArchivo = `HistoriaClinica_${nombrePaciente.replace(/\s+/g, '_')}_${fechaActual}.pdf`;
      
            // Crear un enlace temporal y hacer clic en él para iniciar la descarga
            const a = document.createElement('a');
            a.href = url;
            a.download = nombreArchivo;
            document.body.appendChild(a);
            a.click();
      
            // Limpiar el objeto URL y el enlace temporal
            window.URL.revokeObjectURL(url);
            a.remove();
      
            console.log(`✅ PDF descargado exitosamente: ${nombreArchivo}`);
          },
          error: (error) => {
            console.error('Error al descargar el PDF:', error);
            this.errorMessage = 'Error al descargar la historia clínica. Por favor, inténtelo de nuevo.';
            
            // Limpiar el mensaje de error después de 5 segundos
            setTimeout(() => {
              this.errorMessage = null;
            }, 5000);
          }
        });
      }

} 