import { createBaseProcessor, createWorker, QUEUE_NAMES } from '@app/queue';
import Redis from 'ioredis';

async function bootstrap(): Promise<void> {
  const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
  const connection = new Redis(redisUrl, {
    db: 0,
    maxRetriesPerRequest: null,
  });

  const processor = createBaseProcessor(async (job) => {
    // Provisioning handler is implemented in Phase 1.
    console.log(
      JSON.stringify({
        queue: QUEUE_NAMES.PROVISIONING,
        jobId: job.id,
        idempotencyKey: job.data.idempotencyKey,
        name: job.name,
      }),
    );
  });

  const worker = createWorker(QUEUE_NAMES.PROVISIONING, connection as never, processor, 5);

  worker.on('failed', (job, error) => {
    console.error('Job failed', job?.id, error.message);
  });

  console.log('Worker listening on provisioning queue');
}

void bootstrap();
