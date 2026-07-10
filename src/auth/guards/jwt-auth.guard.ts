import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SERVICE_AUTH_KEY } from '../decorators/service-auth.decorator';
import { isValidApiKey } from '../utils/api-key.util';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const allowsServiceAuth = this.reflector.getAllAndOverride<boolean>(
      SERVICE_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (allowsServiceAuth) {
      const request = context.switchToHttp().getRequest();
      if (isValidApiKey(request)) {
        return true;
      }
    }

    return super.canActivate(context);
  }

  handleRequest<TUser>(err: Error | null, user: TUser): TUser {
    if (err || !user) {
      throw err ?? new UnauthorizedException();
    }

    return user;
  }
}
