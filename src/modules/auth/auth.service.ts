import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

import { compareSync } from 'bcrypt';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (user && compareSync(password, user.password)) {
      delete user.password;
      return instanceToPlain(user); // plaining object
    }
    return null;
  }

  async login(user: Partial<User>) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
