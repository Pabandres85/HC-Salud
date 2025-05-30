import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    template: `
        <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h2>

            <form [formGroup]="perfilForm" (ngSubmit)="onSubmit()" class="space-y-6">
                <div>
                    <label for="nombreCompleto" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
                    <input type="text" id="nombreCompleto" formControlName="nombreCompleto"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>

                <div>
                    <label for="correo" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input type="email" id="correo" formControlName="correo"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                    <input type="password" id="password" formControlName="password"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>

                <div>
                    <label for="confirmarPassword" class="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                    <input type="password" id="confirmarPassword" formControlName="confirmarPassword"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>

                <div class="flex justify-end">
                    <button type="submit"
                        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    `
})
export class PerfilComponent {
    perfilForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        const currentUser = this.authService.getCurrentUser();
        this.perfilForm = this.fb.group({
            nombreCompleto: [currentUser?.nombreCompleto || '', [Validators.required]],
            correo: [currentUser?.correo || '', [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6)]],
            confirmarPassword: ['']
        }, {
            validators: this.passwordMatchValidator
        });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmarPassword')?.value
            ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.perfilForm.valid) {
            // TODO: Implementar actualización de perfil
            console.log('Formulario enviado:', this.perfilForm.value);
        }
    }
} 