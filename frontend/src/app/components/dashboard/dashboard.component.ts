import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <div class="min-h-screen bg-gray-100">
            <!-- Navbar -->
            <nav class="bg-white shadow-md relative z-10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <!-- Aquí podrías poner un logo si tienes uno -->
                                <h1 class="text-2xl font-bold text-gray-900">Psicología HC</h1>
                            </div>
                            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <a routerLink="/dashboard/inicio" routerLinkActive="border-indigo-500 text-gray-900" [routerLinkActiveOptions]="{exact: true}"
                                   class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Inicio</a>
                                <a routerLink="/dashboard/pacientes" routerLinkActive="border-indigo-500 text-gray-900" [routerLinkActiveOptions]="{exact: true}"
                                   class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Pacientes</a>
                                <!-- Añadir más enlaces de navegación aquí -->
                            </div>
                        </div>
                        <div class="-mr-2 flex items-center sm:hidden">
                            <!-- Mobile menu button -->
                            <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-controls="mobile-menu" aria-expanded="false">
                                <span class="sr-only">Abrir menú principal</span>
                                <!-- Iconos de menú -->
                                <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="hidden sm:ml-6 sm:flex sm:items-center">
                             <!-- Info de usuario y botón de logout -->
                             <span class="text-gray-700 text-sm font-semibold mr-3">{{ currentUser?.nombreCompleto }}</span>
                            <button (click)="logout()"
                                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mobile menu, show/hide based on menu state. -->
                <div class="sm:hidden" id="mobile-menu">
                    <div class="pt-2 pb-3 space-y-1">
                        <a routerLink="/dashboard/inicio" routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700" [routerLinkActiveOptions]="{exact: true}"
                           class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Inicio</a>
                        <a routerLink="/dashboard/pacientes" routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700" [routerLinkActiveOptions]="{exact: true}"
                           class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Pacientes</a>
                         <!-- Añadir más enlaces de navegación aquí -->
                    </div>
                     <div class="pt-4 pb-3 border-t border-gray-200">
                         <div class="flex items-center px-5">
                              <div class="flex-shrink-0">
                                   <!-- Avatar de usuario si hay -->
                              </div>
                              <div class="ml-3">
                                   <div class="text-base font-medium text-gray-800">{{ currentUser?.nombreCompleto }}</div>
                                   <!-- <div class="text-sm font-medium text-gray-500">{{ currentUser?.correo }}</div> -->
                              </div>
                         </div>
                         <div class="mt-3 space-y-1 px-2">
                              <button (click)="logout()"
                                    class="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                    Cerrar sesión
                               </button>
                         </div>
                     </div>
                </div>
            </nav>

            <!-- Contenido principal del Dashboard -->
            <main>
                <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <router-outlet></router-outlet>
                </div>
            </main>
        </div>
    `,
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    currentUser: any; // Considera tipado más específico

    constructor(private authService: AuthService) {
        this.currentUser = this.authService.getCurrentUser(); // Restaurar la forma original de obtener el usuario
    }

    logout(): void {
        this.authService.logout();
    }
}