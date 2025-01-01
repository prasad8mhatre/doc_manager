import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import  { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    
    const user = await this.usersService.findByUsernameWithPassword(registerDto.username);
    if(user != undefined){
      throw new UnauthorizedException('User already exist');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        return this.usersService.create({ ...registerDto, password: hashedPassword });
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsernameWithPassword(loginDto.username);
    //console.log("User details: " +  JSON.stringify(user));
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }
}