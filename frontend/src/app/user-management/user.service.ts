import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  createUser(user: { username: string; role: string }): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateUserRole(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${user.id}/role`, user);
  }
}
