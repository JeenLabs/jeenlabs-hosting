import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorCode } from '@app/types';
import { AppException } from '../errors/app.exception';
import type { AuthUser } from '../decorators/current-user.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    const user = request.user;
    if (!user) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, 'Authentication required', 401);
    }

    const hasRole = requiredRoles.some((role) => user.staffRoles.includes(role));
    if (!hasRole) {
      throw new AppException(ErrorCode.FORBIDDEN, 'Insufficient permissions', 403);
    }

    return true;
  }
}
