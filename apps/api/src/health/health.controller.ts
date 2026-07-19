import { Controller, Get, Inject } from '@nestjs/common';
import type Redis from 'ioredis';
import { Public } from '../common/decorators/roles.decorator';
import { PrismaService } from '../infra/prisma/prisma.service';
import { REDIS_QUEUE } from '../infra/redis/redis.module';

@Controller()
export class HealthController {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(REDIS_QUEUE) private readonly redis: Redis,
  ) {}

  @Public()
  @Get('health')
  health() {
    return { data: { status: 'ok' } };
  }

  @Public()
  @Get('ready')
  async ready() {
    await this.prisma.$queryRaw`SELECT 1`;
    const pong = await this.redis.ping();
    if (pong !== 'PONG') {
      throw new Error('Redis not ready');
    }
    return { data: { status: 'ready' } };
  }
}
