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
        return user ? user.token : null;
    }

    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }

    getCurrentUser(): AuthResponse | null {
        return this.currentUserSubject.value;
    }
} 