import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: '',
                redirectTo: 'inicio',
                pathMatch: 'full'
            },
            {
                path: 'inicio',
                loadComponent: () => import('./pages/inicio/inicio.component').then(m => m.InicioComponent)
            },
            {
                path: 'pacientes',
                loadComponent: () => import('./pages/pacientes/pacientes.component').then(m => m.PacientesComponent)
            },
            {
                path: 'perfil',
                loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent)
            },
            {
                path: 'pacientes/:pacienteId/historia-clinica',
                loadComponent: () => import('./pages/historia-clinica-integral/historia-clinica-integral-view.component').then(m => m.HistoriaClinicaIntegralViewComponent)
            },
            {
                path: 'pacientes/:pacienteId/historia-clinica/crear-anamnesis',
                loadComponent: () => import('./pages/historia-clinica-integral/anamnesis-form.component').then(m => m.AnamnesisFormComponent)
            },
            {
                path: 'pacientes/:pacienteId/historia-clinica/anamnesis/:anamnesisId/editar',
                loadComponent: () => import('./pages/historia-clinica-integral/anamnesis-form.component').then(m => m.AnamnesisFormComponent)
            },
            {
                path: 'pacientes/:id/historias-clinicas',
                loadComponent: () => import('./pages/historias-clinicas/historia-clinica-list.component').then(m => m.HistoriaClinicaListComponent)
            },
            {
                path: 'pacientes/:pacienteId/historias-clinicas/nueva',
                loadComponent: () => import('./pages/historias-clinicas/historia-clinica-form.component').then(m => m.HistoriaClinicaFormComponent)
            },
            {
                path: 'historias-clinicas/:id/editar',
                loadComponent: () => import('./pages/historias-clinicas/historia-clinica-form.component').then(m => m.HistoriaClinicaFormComponent)
            },
            {
                path: 'historias-clinicas/:id',
                loadComponent: () => import('./pages/historias-clinicas/historia-clinica-detail.component').then(m => m.HistoriaClinicaDetailComponent)
            },
            {
                path: 'pacientes/:pacienteId/citas',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./pages/citas/cita-list.component').then(m => m.CitaListComponent)
                    },
                    {
                        path: 'nueva',
                        loadComponent: () => import('./pages/citas/cita-form.component').then(m => m.CitaFormComponent)
                    },
                    {
                        path: ':citaId/editar',
                        loadComponent: () => import('./pages/citas/cita-form.component').then(m => m.CitaFormComponent)
                    }
                ]
            }
        ]
    }
]; 