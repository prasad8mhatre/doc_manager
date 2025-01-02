import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule], // Import FormsModule here
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  newUser = { username: '', role: '' };
  roles = ['admin', 'user',];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  addUser(): void {
    this.userService.createUser(this.newUser).subscribe(() => {
      this.loadUsers();
      this.newUser = { username: '',  role: '' }; // Reset form
    });
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }

  updateRole(user: any): void {
    this.userService.updateUserRole(user).subscribe(() => {
      this.loadUsers();
    });
  }
}
