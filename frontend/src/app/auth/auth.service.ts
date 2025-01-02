import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false); // Store authentication status
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable(); // Observable to be subscribed to

  constructor(private http: HttpClient) {}

  // Login method
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      
      map((response:any) =>{
        const accessToken = response["accessToken"];
      
        // Store the token in local storage
        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
        }
        this.isAuthenticatedSubject.next(true);
        return response; 
      })
    );
  }

  // Sign-up method
  signUp(user: { username: string; password: string; role: string}): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  // Logout method
  logout(): void {
    this.isAuthenticatedSubject.next(false);
    
    localStorage.clear();
  }

  // Set the authentication status
  setAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  isAuthenticated(){
    const accessToken = localStorage.getItem('access_token');
    if(accessToken != undefined){
      return true;
    }else{
      return false;
    }
  }
}
