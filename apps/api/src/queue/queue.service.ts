import { Inject, Injectable } from '@nestjs/common';
import { enqueue } from '@app/queue';
import type { Queue } from 'bullmq';
import { PROVISIONING_QUEUE } from './queue.constants';

@Injectable()
export class QueueService {
  constructor(@Inject(PROVISIONING_QUEUE) private readonly provisioningQueue: Queue) {}

  enqueueProvisioning(
    payload: Record<string, unknown>,
    options: { idempotencyKey: string; requestId?: string },
  ): Promise<string> {
    return enqueue(this.provisioningQueue, 'provision', payload, options);
  }
}
