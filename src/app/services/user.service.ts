import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_URL } from '../constants/constant';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private http = inject(HttpClient);

  registerUser(data: any): Observable<any> {
    if (data) {
      return this.http.post(API_URL + `tenant/${data.tenantId}/user`, data);
    }
    return of({});
  }

  registerTenant(data: any): Observable<any> {
    if (data) {
      return this.http.post(API_URL + `tenant/register`, data);
    }
    return of({});
  }

  loginUser(data: any): Observable<any> {
    if (data) {
      return this.http.post(API_URL + 'tenant/auth/login', data);
    }
    return of({});
  }

  getUserDetails(data: any): Observable<any> {
    if (data) {
      return this.http.get(API_URL + `tenant/${data.tenantId}/user_details/${data.id}`);
    }
    return of({});
  }

  getAllManagers(tenantId: string): Observable<any> {
    if (tenantId) {
      return this.http.get(API_URL + `tenant/${tenantId}/managers`);
    }
    return of({});
  }
}
