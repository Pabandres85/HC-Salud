import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../../../services/paciente.service';
import { DashboardService } from '../../../../services/dashboard.service';

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="card dashboard-inicio">
            <h2 class="dashboard-title">Bienvenido al Sistema</h2>
            <div class="dashboard-grid">
                <!-- Tarjeta de Pacientes -->
                <div class="dashboard-card dashboard-card-indigo">
                    <h3>Pacientes</h3>
                    <p class="dashboard-card-num">{{ totalPacientes }}</p>
                    <p class="dashboard-card-desc">Total de pacientes registrados</p>
                </div>
                <!-- Tarjeta de Consultas -->
                <div class="dashboard-card dashboard-card-green">
                    <h3>Consultas</h3>
                    <p class="dashboard-card-num">{{ consultasEsteMes }}</p>
                    <p class="dashboard-card-desc">Consultas realizadas este mes</p>
                </div>
                <!-- Tarjeta de Próximas Citas -->
                <div class="dashboard-card dashboard-card-yellow">
                    <h3>Próximas Citas</h3>
                    <p class="dashboard-card-num">{{ citasHoy }}</p>
                    <p class="dashboard-card-desc">Citas programadas para hoy</p>
                </div>
            </div>
            <div class="dashboard-actividad">
                <h3>Actividad Reciente</h3>
                <div class="dashboard-actividad-list">
                    <!-- Iterar sobre la lista de actividad reciente -->
                    <ng-container *ngIf="recentActivity.length > 0; else noActivity">
                        <div *ngFor="let activity of recentActivity" class="activity-item">
                            <p><strong>{{ activity.type }}:</strong> {{ activity.description }}</p>
                            <small>{{ activity.date | date:'short' }}</small>
                        </div>
                    </ng-container>
                    <!-- Mostrar mensaje si no hay actividad -->
                    <ng-template #noActivity>
                        <p class="dashboard-actividad-empty">No hay actividad reciente</p>
                    </ng-template>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: block; /* Asegura que el componente ocupe su propio espacio */
            padding: 1.5rem; /* Añadir padding general al host si es necesario, o depender del contenedor padre */
        }
        .card {
             /* Estilo base para contenedores tipo tarjeta, si se usa consistentemente */
             background-color: #ffffff; /* Fondo blanco para las tarjetas principales o contenedores */
             border-radius: 8px; /* Bordes ligeramente redondeados */
             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); /* Sombra suave */
             padding: 1.5rem; /* Espaciado interno */
        }
        .dashboard-inicio {
            padding: 1.5rem; /* Ajustar padding si el host ya tiene */
            background: linear-gradient(135deg, #e0e7ff 0%, #e6fffa 100%); /* Gradiente de fondo sutil */
            border-radius: 12px; /* Bordes redondeados para el contenedor principal */
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        .dashboard-title {
            font-size: 2rem; /* Tamaño de fuente */
            font-weight: 600; /* Peso de fuente semi-bold */
            color: #2c3e50; /* Color de texto oscuro */
            margin-bottom: 1.5rem; /* Margen inferior */
            text-align: center; /* Centrar título */
        }
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Grid responsive */
            gap: 1.5rem; /* Espacio entre tarjetas */
            margin-bottom: 2rem; /* Margen inferior */
        }
        /* @media (min-width: 700px) { */
        /*     .dashboard-grid { */
        /*         grid-template-columns: repeat(3, 1fr); */
        /*     } */
        /* } */
        .dashboard-card {
            border-radius: 10px; /* Bordes de tarjeta más redondeados */
            padding: 1.5rem; /* Espaciado interno de tarjeta */
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); /* Sombra mejorada */
            /* background: #f7fafc; */ /* Fondo base eliminado para usar los colores específicos */
            text-align: left; /* Alinear texto a la izquierda */
            display: flex;
            flex-direction: column;
            justify-content: space-between; /* Espacio entre contenido */
            transition: transform 0.3s ease, box-shadow 0.3s ease; /* Transición para hover */
        }
         .dashboard-card:hover {
             transform: translateY(-5px); /* Efecto hover sutil */
             box-shadow: 0 8px 15px rgba(0, 0, 0, 0.12); /* Sombra más pronunciada en hover */
         }
        .dashboard-card h3 {
            font-size: 1.2rem; /* Tamaño de fuente del título de tarjeta */
            color: #34495e; /* Color de texto más suave */
            margin-bottom: 0.5rem;
            font-weight: 600; /* Semi-bold */
        }
        .dashboard-card-num {
            font-size: 2.5rem; /* Tamaño de fuente del número */
            font-weight: 700; /* Bold */
            margin: 0.5rem 0; /* Margen ajustado */
            color: #2c3e50; /* Color para los números */
        }
        .dashboard-card-desc {
            font-size: 0.9rem; /* Tamaño de fuente más pequeño para la descripción */
            color: #7f8c8d; /* Color de texto gris */
            margin-top: auto; /* Empujar descripción hacia abajo */
        }
        /* Colores de fondo específicos ajustados */
        .dashboard-card-indigo {
            background: #eef2ff; /* Tono más suave */
        }
        .dashboard-card-green {
            background: #e0f7fa; /* Tono más suave */
        }
        .dashboard-card-yellow {
            background: #fff9c4; /* Tono más suave */
        }
        .dashboard-actividad {
            margin-top: 2rem; /* Margen superior */
        }
        .dashboard-actividad h3 {
            font-size: 1.2rem; /* Tamaño de fuente */
            color: #34495e; /* Color de texto */
            margin-bottom: 1rem; /* Margen inferior */
             font-weight: 600; /* Semi-bold */
        }
        .dashboard-actividad-list {
            background: #ffffff; /* Fondo blanco */
            border-radius: 8px; /* Bordes redondeados */
            padding: 1.2rem; /* Espaciado interno */
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Sombra */
        }
        .activity-item {
            border-bottom: 1px solid #eee; /* Separador entre actividades */
            padding: 0.8rem 1rem;
            
            &:last-child { /* Sin borde en el último elemento */
                border-bottom: none;
            }
        }
        .activity-item p {
             margin-bottom: 0.2rem;
             color: #34495e; /* Color de texto principal */
        }
        .activity-item small {
            color: #95a5a6; /* Color de texto secundario para la fecha */
            font-size: 0.8rem;
        }
        .dashboard-actividad-empty {
            color: #95a5a6; /* Color de texto gris más claro */
            text-align: center;
            font-size: 1rem;
            padding: 1rem;
        }
    `]
})
export class InicioComponent implements OnInit {
    totalPacientes: number = 0; // Propiedad para almacenar el total de pacientes
    consultasEsteMes: number = 0; // Propiedad para almacenar el total de consultas este mes
    citasHoy: number = 0; // Propiedad para almacenar el total de citas para hoy
    recentActivity: any[] = []; // Propiedad para almacenar la actividad reciente

    constructor(private pacienteService: PacienteService, private dashboardService: DashboardService) { }

    ngOnInit(): void {
        // Obtener total de pacientes (usando el endpoint de contadores)
        // this.pacienteService.getPacientes(1, 1)
        //     .subscribe({
        //         next: (response) => {
        //             this.totalPacientes = response.total || 0;
        //         },
        //         error: (error) => {
        //             console.error('Error al obtener pacientes:', error);
        //             this.totalPacientes = 0;
        //         }
        //     });

        // Obtener contadores del dashboard
        this.dashboardService.getDashboardCounts()
            .subscribe({
                next: (counts) => {
                    console.log('Contadores recibidos:', counts); // Añadido para depuración
                    this.totalPacientes = counts.totalPacientes || 0; // Asumiendo que la respuesta tiene totalPacientes
                    this.consultasEsteMes = counts.consultasEsteMes || 0; // Asumiendo que la respuesta tiene consultasEsteMes
                    this.citasHoy = counts.citasHoy || 0; // Asumiendo que la respuesta tiene citasHoy
                },
                error: (error) => {
                    console.error('Error al obtener contadores del dashboard:', error); // Mantener error original
                    // Intenta loggear el cuerpo del error si está disponible (para errores HTTP)
                    if (error.error) {
                        console.error('Cuerpo del error:', error.error);
                    }
                    this.totalPacientes = 0; // Resetear contadores en caso de error
                    this.consultasEsteMes = 0;
                    this.citasHoy = 0;
                }
            });

        // Obtener actividad reciente
        this.dashboardService.getRecentActivity()
            .subscribe({
                next: (activity) => {
                    this.recentActivity = activity;
                },
                error: (error) => {
                    console.error('Error al obtener actividad reciente:', error);
                    this.recentActivity = []; // En caso de error, mostrar lista vacía
                }
            });
    }
} 