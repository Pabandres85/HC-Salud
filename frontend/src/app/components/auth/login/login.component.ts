import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    template: `
        <div class="login-bg">
            <div class="login-card">
                <div class="login-icon">🧠</div>
                <h2 class="login-title">Iniciar Sesión</h2>
                <p class="login-subtitle">Sistema de Psicología</p>
                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
                    <div class="login-field">
                        <label for="correo">Correo electrónico</label>
                        <input id="correo" name="correo" type="email" formControlName="correo" placeholder="Correo electrónico">
                        <div *ngIf="loginForm.get('correo')?.invalid && (loginForm.get('correo')?.touched || loginForm.get('correo')?.dirty)" class="login-error">
                            <span *ngIf="loginForm.get('correo')?.errors?.['required']">El correo es obligatorio.</span>
                            <span *ngIf="loginForm.get('correo')?.errors?.['email']">Correo no válido.</span>
                        </div>
                    </div>
                    <div class="login-field">
                        <label for="password">Contraseña</label>
                        <input id="password" name="password" type="password" formControlName="password" placeholder="Contraseña">
                        <div *ngIf="loginForm.get('password')?.invalid && (loginForm.get('password')?.touched || loginForm.get('password')?.dirty)" class="login-error">
                            <span *ngIf="loginForm.get('password')?.errors?.['required']">La contraseña es obligatoria.</span>
                            <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Mínimo 6 caracteres.</span>
                        </div>
                    </div>
                    <div *ngIf="loginError" class="login-error login-error-main">
                        {{ loginError }}
                    </div>
                    <button type="submit" [disabled]="loginForm.invalid || loading" class="login-btn">
                        <span *ngIf="!loading">Iniciar Sesión</span>
                        <span *ngIf="loading">Iniciando...</span>
                    </button>
                    <div class="login-register">
                        <a routerLink="/registro">¿No tienes cuenta? Regístrate</a>
                    </div>
                </form>
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
        @media (max-width: 500px) {
            .login-card {
                padding: 1.5rem 0.5rem 1.5rem 0.5rem;
            }
        }
    `]
})
export class LoginComponent {
    loginForm: FormGroup;
    loading = false;
    loginError: string | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            correo: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.loading = true;
            this.loginError = null;
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    this.loading = false;
                    this.loginError = 'Correo o contraseña incorrectos.';
                    console.error('Error en el login:', error);
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
} 