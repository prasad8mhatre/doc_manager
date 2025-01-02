import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {jwtDecode} from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    RouterOutlet, RouterLink, RouterLinkActive


  ], // Import FormsModule here
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  credentials = { username: '', password: '' };
  error = undefined;

  constructor(private authService: AuthService, private router: Router) {
    
    
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'user') {
        this.router.navigate(['/document-management']);
      } else {
        this.router.navigate(['/user-management']);
      }
    }
  }

  login(): void {
    this.authService.login(this.credentials).subscribe(
      (response) => {
        const token = response.accessToken;
        const decodedToken: any = jwtDecode(token);
        const userRole = decodedToken.role;
        console.log('User role:', userRole); 
        localStorage.setItem('userRole', userRole);

        if (userRole =='user'){
          this.router.navigate(['/document-management'])
        }else{
          this.router.navigate(['/user-management'])
        }
        
        
      },
      error => {this.error = error; console.error('Login failed', error)}
    );
  }
}
