import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QaService {
  private apiUrl = `${environment.inferUrl}/qa`;

  constructor(private http: HttpClient) {}

  askQuestion(question: string, docId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/infer`, { "question": question, "docId": docId  });
  }
}
