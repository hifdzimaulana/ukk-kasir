import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { CaslAbiltyFactory } from '../casl/casl-abilty.factory';
import { User } from '../user/user.entity';
import { AuthRequestType } from './auth-request.type';
import { IS_PUBLIC_KEY } from './public-route.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-strategy') {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbiltyFactory,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // skip route who has @PublicRoute decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  // add ability to req.user
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    user.ability = this.caslAbilityFactory.createForUser(user);
    return user;
  }
}
