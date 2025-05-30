import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    template: `
        <div class="login-bg">
            <div class="login-card">
                <div class="login-icon">🧠</div>
                <h2 class="login-title">Registro de Usuario</h2>
                <p class="login-subtitle">Crea tu cuenta de psicólogo</p>
                <form [formGroup]="registroForm" (ngSubmit)="onSubmit()" novalidate *ngIf="!registroExitoso">
                    <div class="login-field">
                        <label for="nombreCompleto">Nombre Completo</label>
                        <input id="nombreCompleto" name="nombreCompleto" type="text" formControlName="nombreCompleto" placeholder="Nombre Completo">
                        <div *ngIf="registroForm.get('nombreCompleto')?.invalid && (registroForm.get('nombreCompleto')?.touched || registroForm.get('nombreCompleto')?.dirty)" class="login-error">
                            <span *ngIf="registroForm.get('nombreCompleto')?.errors?.['required']">El nombre es obligatorio.</span>
                            <span *ngIf="registroForm.get('nombreCompleto')?.errors?.['minlength']">Mínimo 3 caracteres.</span>
                        </div>
                    </div>
                    <div class="login-field">
                        <label for="correo">Correo electrónico</label>
                        <input id="correo" name="correo" type="email" formControlName="correo" placeholder="Correo electrónico">
                        <div *ngIf="registroForm.get('correo')?.invalid && (registroForm.get('correo')?.touched || registroForm.get('correo')?.dirty)" class="login-error">
                            <span *ngIf="registroForm.get('correo')?.errors?.['required']">El correo es obligatorio.</span>
                            <span *ngIf="registroForm.get('correo')?.errors?.['email']">Correo no válido.</span>
                        </div>
                    </div>
                    <div class="login-field">
                        <label for="password">Contraseña</label>
                        <input id="password" name="password" type="password" formControlName="password" placeholder="Contraseña">
                        <div *ngIf="registroForm.get('password')?.invalid && (registroForm.get('password')?.touched || registroForm.get('password')?.dirty)" class="login-error">
                            <span *ngIf="registroForm.get('password')?.errors?.['required']">La contraseña es obligatoria.</span>
                            <span *ngIf="registroForm.get('password')?.errors?.['minlength']">Mínimo 6 caracteres.</span>
                        </div>
                    </div>
                    <div class="login-field">
                        <label for="confirmarPassword">Confirmar Contraseña</label>
                        <input id="confirmarPassword" name="confirmarPassword" type="password" formControlName="confirmarPassword" placeholder="Confirmar Contraseña">
                        <div *ngIf="registroForm.hasError('mismatch') && (registroForm.get('confirmarPassword')?.touched || registroForm.get('confirmarPassword')?.dirty)" class="login-error">
                            Las contraseñas no coinciden.
                        </div>
                    </div>
                    <div *ngIf="registroError" class="login-error login-error-main">
                        {{ registroError }}
                    </div>
                    <button type="submit" [disabled]="registroForm.invalid || loading" class="login-btn">
                        <span *ngIf="!loading">Registrarse</span>
                        <span *ngIf="loading">Registrando...</span>
                    </button>
                    <div class="login-register">
                        <a routerLink="/login">¿Ya tienes cuenta? Inicia sesión</a>
                    </div>
                </form>
                <div *ngIf="registroExitoso" class="registro-exito">
                    <div class="registro-exito-icon">✅</div>
                    <h3>¡Registro exitoso!</h3>
                    <p>Tu cuenta ha sido creada correctamente.</p>
                    <button class="btn" (click)="irAlLogin()">Ir a Iniciar Sesión</button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .login-bg {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .login-card {
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 8px 32px rgba(44, 62, 80, 0.15);
            padding: 2.5rem 2rem 2rem 2rem;
            max-width: 370px;
            width: 100%;
            text-align: center;
        }
        .login-icon {
            font-size: 2.5rem;
            background: #e0e7ff;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem auto;
        }
        .login-title {
            font-size: 2rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 0.2rem;
        }
        .login-subtitle {
            color: #666;
            font-size: 1rem;
            margin-bottom: 1.5rem;
        }
        .login-field {
            margin-bottom: 1.2rem;
            text-align: left;
        }
        .login-field label {
            display: block;
            font-size: 0.95rem;
            color: #444;
            margin-bottom: 0.3rem;
        }
        .login-field input {
            width: 100%;
            padding: 0.6rem 0.8rem;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 1rem;
            outline: none;
            transition: border 0.2s;
        }
        .login-field input:focus {
            border-color: #667eea;
        }
        .login-error {
            color: #e53e3e;
            font-size: 0.85rem;
            margin-top: 0.2rem;
        }
        .login-error-main {
            margin-bottom: 1rem;
        }
        .login-btn {
            width: 100%;
            padding: 0.7rem;
            background: #667eea;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 0.5rem;
            transition: background 0.2s;
        }
        .login-btn:disabled {
            background: #b3bcf5;
            cursor: not-allowed;
        }
        .login-register {
            margin-top: 1.2rem;
            font-size: 0.97rem;
        }
        .login-register a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }
        .login-register a:hover {
            text-decoration: underline;
        }
        .registro-exito {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem 0 1rem 0;
        }
        .registro-exito-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .btn {
            background: #667eea;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 0.7rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1.2rem;
            transition: background 0.2s;
        }
        .btn:hover {
            background: #4c51bf;
        }
        @media (max-width: 500px) {
            .login-card {
                padding: 1.5rem 0.5rem 1.5rem 0.5rem;
            }
        }
    `]
})
export class RegistroComponent {
    registroForm: FormGroup;
    loading = false;
    registroError: string | null = null;
    registroExitoso = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registroForm = this.fb.group({
            nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
            correo: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmarPassword: ['', [Validators.required]],
            rol: ['psicologo']
        }, {
            validators: this.passwordMatchValidator
        });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmarPassword')?.value
            ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.registroForm.valid) {
            this.loading = true;
            this.registroError = null;
            this.authService.registro(this.registroForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.registroExitoso = true;
                },
                error: (error) => {
                    this.loading = false;
                    this.registroError = 'No se pudo registrar. Intenta con otro correo o revisa los datos.';
                    console.error('Error en el registro:', error);
                }
            });
        } else {
            this.registroForm.markAllAsTouched();
        }
    }

    irAlLogin() {
        this.router.navigate(['/login']);
    }
} 