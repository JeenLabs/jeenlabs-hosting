import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { RbacGuard } from './common/guards/rbac.guard';
import { HealthController } from './health/health.controller';
import { BetterAuthModule } from './infra/better-auth/better-auth.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { RedisModule } from './infra/redis/redis.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuthMeController } from './modules/auth/auth-me.controller';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [PrismaModule, RedisModule, BetterAuthModule, AuditModule, QueueModule],
  controllers: [HealthController, AuthMeController],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RbacGuard },
  ],
})
export class AppModule {}
