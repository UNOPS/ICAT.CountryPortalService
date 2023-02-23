import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const apiKeys = ['1234', '56789'];
    const request = context.switchToHttp().getRequest();
    const headerFieldValue = request.headers;

    return apiKeys.includes(request.headers['api-key']);
  }
}
