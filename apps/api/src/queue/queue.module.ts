import { Global, Module } from '@nestjs/common';
import { createQueue, QUEUE_NAMES } from '@app/queue';
import { PROVISIONING_QUEUE } from './queue.constants';
import { QueueService } from './queue.service';

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
