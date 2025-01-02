import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  uploadDocument(formData: FormData): Observable<any> {
    const accessToken = localStorage.getItem('access_token');

    const headers = {
      'Authorization': `Bearer ${accessToken}`
    };

    return this.http.post(`${this.apiUrl}`, formData,{ headers });
  }

  getDocuments(): Observable<any> {
    const accessToken = localStorage.getItem('access_token');

    const headers = {
      'Authorization': `Bearer ${accessToken}`
    };
    return this.http.get(`${this.apiUrl}`,{ headers });
  }

  deleteDocument(id: string): Observable<any> {
    const accessToken = localStorage.getItem('access_token');

    const headers = {
      'Authorization': `Bearer ${accessToken}`
    };
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers });
  }
}
