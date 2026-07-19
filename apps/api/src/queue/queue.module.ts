import { Global, Module } from '@nestjs/common';
import { createQueue, QUEUE_NAMES } from '@app/queue';
import { QueueService } from './queue.service';

export const PROVISIONING_QUEUE = 'PROVISIONING_QUEUE';

@Global()
@Module({
  providers: [
    {
      provide: PROVISIONING_QUEUE,
      useFactory: () =>
        createQueue(QUEUE_NAMES.PROVISIONING, {
          url: process.env.REDIS_URL ?? 'redis://localhost:6379',
          db: 0,
          maxRetriesPerRequest: null,
        }),
    },
    QueueService,
  ],
  exports: [QueueService, PROVISIONING_QUEUE],
})
export class QueueModule {}
