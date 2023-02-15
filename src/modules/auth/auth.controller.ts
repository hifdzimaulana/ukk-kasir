import { Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { Actions, CaslAbiltyFactory } from '../casl/casl-abilty.factory';
import { AuthRequestType } from './auth-request.type';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
