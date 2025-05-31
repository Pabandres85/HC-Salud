import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/api/dashboard`; 

  constructor(private http: HttpClient) { }

  getRecentActivity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/RecentActivity`);
  }

  getDashboardCounts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Counts`);
  }

}