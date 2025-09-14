import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_URL } from '../constants/constant';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(private http: HttpClient) {

  }

  loadProjects(data: any): Observable<any> {
    if (data) {
      return this.http.get(`${API_URL}${data.tenantId}/projects`);
    }
    return of({});
  }

  createProject(data: any): Observable<any> {
    if (data) {
      return this.http.post(`${API_URL}${data.tenantId}/projects`, data);
    }
    return of({});
  }

  updateProject(data: any): Observable<any> {
    if (data) {
      return this.http.put(`${API_URL}${data.tenantId}/projects/${data._id}`, data);
    }
    return of({});
  }

  deleteProject(data: any): Observable<any> {
    if (data) {
      return this.http.delete(`${API_URL}${data.tenantId}/projects/${data._id}`);
    }
    return of({});
  }
}
