import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(process.env.API_KEY_1)
    const apiKeys = [process.env.API_KEY_1, process.env.API_KEY_2];
    const request = context.switchToHttp().getRequest();
    return apiKeys.includes(request.headers['api-key']);
  }
}
