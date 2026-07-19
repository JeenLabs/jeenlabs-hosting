import { Inject, Injectable } from '@nestjs/common';
import type { ActorType, Prisma } from '@app/db';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async write(entry: {
    actorType: ActorType;
    actorId?: string;
    action: string;
    entityType?: string;
    entityId?: string;
    ip?: string;
    before?: Prisma.InputJsonValue;
    after?: Prisma.InputJsonValue;
  }): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorType: entry.actorType,
        actorId: entry.actorId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        ip: entry.ip,
        before: entry.before,
        after: entry.after,
      },
    });
  }
}
