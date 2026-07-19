import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';
import { ErrorCode } from '@app/types';
import { AppException } from '../errors/app.exception';
import type { AuthUser } from '../decorators/current-user.decorator';
import { PUBLIC_KEY } from '../decorators/roles.decorator';
import { BETTER_AUTH, type BetterAuthInstance } from '../../infra/better-auth/better-auth';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(BETTER_AUTH) private readonly auth: BetterAuthInstance,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const session = await this.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session?.user) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, 'Authentication required', 401);
    }

    const [customer, staff] = await Promise.all([
      this.prisma.customer.findUnique({ where: { userId: session.user.id } }),
      this.prisma.staff.findUnique({
        where: { userId: session.user.id },
        include: { roles: { include: { staffRole: true } } },
      }),
    ]);

    request.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      emailVerified: session.user.emailVerified,
      customerId: customer?.id,
      staffId: staff?.id,
      staffRoles: staff?.roles.map((assignment) => assignment.staffRole.name) ?? [],
    };

    return true;
  }
}
