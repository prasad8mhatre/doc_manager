import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find();
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByUsernameWithPassword(username: string) {
    return this.userRepository.findOne({ where: { username } ,select: ['id', 'username', 'password','role']});
  }

  async create(user: Partial<User>) {
    return this.userRepository.save(user);
  }

  async updateRole(id: number, role: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    user.role = role;
    return this.userRepository.save(user);
  }
}