import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [FormsModule,MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule], // Import FormsModule here
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  user = { username: '', password: '', role: 'user' };

  constructor(private authService: AuthService, private router: Router) {}

  signUp(): void {
    this.authService.signUp(this.user).subscribe(
      () => this.router.navigate(['/']),
      error => console.error('Error during sign-up', error)
    );
  }
}
