import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Override the handleRequest method to get the token body
  handleRequest(err: any, user: any, info: any, context: ExecutionContext): any {
    // You can access the user (decoded payload) here
    return user; // The decoded JWT payload will be in the `user` object
  }
}