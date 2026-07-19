import { describe, expect, it } from 'vitest';
import { Reflector } from '@nestjs/core';
import { ErrorCode } from '@app/types';
import { AppException } from '../errors/app.exception';
import { RbacGuard } from './rbac.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RbacGuard', () => {
  it('allows when no roles are required', () => {
    const reflector = {
      getAllAndOverride: () => undefined,
    } as unknown as Reflector;
    const guard = new RbacGuard(reflector);
    const ctx = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({ getRequest: () => ({ user: { staffRoles: [] } }) }),
    } as never;
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('denies when staff lacks required role', () => {
    const reflector = {
      getAllAndOverride: (key: string) => (key === ROLES_KEY ? ['super_admin'] : undefined),
    } as unknown as Reflector;
    const guard = new RbacGuard(reflector);
    const ctx = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: { staffRoles: ['support'] } }),
      }),
    } as never;
    try {
      guard.canActivate(ctx);
      throw new Error('expected AppException');
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);
      expect((error as AppException).code).toBe(ErrorCode.FORBIDDEN);
    }
  });
});
