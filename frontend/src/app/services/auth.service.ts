import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegistroRequest, RegistroResponse } from '../models/auth.models';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/api/auth`;
    private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUserSubject.next(JSON.parse(storedUser));
        }
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => {
                localStorage.setItem('currentUser', JSON.stringify(response));
                this.currentUserSubject.next(response);
            })
        );
    }

    registro(request: RegistroRequest): Observable<RegistroResponse> {
        return this.http.post<RegistroResponse>(`${this.apiUrl}/registro`, request);
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        const user = this.currentUserSubject.value;
        console.log('🔍 AuthService.getToken() llamado');
        console.log('🔍 currentUserSubject.value:', user);
        console.log('🔍 localStorage currentUser:', localStorage.getItem('currentUser'));
        if (user && user.token) {
            console.log('✅ Token encontrado:', user.token.substring(0, 20) + '...');
            return user.token;
        } else {
            console.log('❌ No se encontró token en currentUserSubject');
            
            // 🔧 FALLBACK: Intentar obtener directamente de localStorage
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    console.log('🔧 Fallback - Usuario del localStorage:', parsedUser);
                    if (parsedUser.token) {
                        console.log('🔧 Fallback - Token encontrado en localStorage');
                        return parsedUser.token;
                    }
                } catch (error) {
                    console.error('❌ Error al parsear usuario del localStorage:', error);
                }
            }
            
            return null;
        }
    }

    

    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }

    getCurrentUser(): AuthResponse | null {
        return this.currentUserSubject.value;
    }
} 