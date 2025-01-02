import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoggedIn: boolean = false;  // Track if the user is logged in
  username: string = '';  
  private authSubscription!: Subscription;
  

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (authStatus) => {
        this.isLoggedIn = authStatus;
      }
    );

    // Check if the user is logged in (check localStorage for token or role)
    const token = localStorage.getItem('access_token');
    this.isLoggedIn = !!token; // If a token exists, user is logged in
    if (this.isLoggedIn) {
      // Optionally, extract the username or other details from the token
      //const decodedToken: any = jwt_decode(token);
      //this.username = decodedToken.username || 'User'; // Adjust field name based on your token
    }
  }

  logout(): void {
    this.authService.logout();

    // Navigate to the login page
    this.router.navigate(['/']);
  }

}
