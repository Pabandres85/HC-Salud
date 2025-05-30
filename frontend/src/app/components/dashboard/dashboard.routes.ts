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
            }
        ]
    }
]; 