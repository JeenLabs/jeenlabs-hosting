import { Queue, type ConnectionOptions, type JobsOptions } from 'bullmq';
import {
  buildJobId,
  DEFAULT_JOB_ATTEMPTS,
  type EnqueueOptions,
  type JobEnvelope,
  type QueueName,
} from './types';

export function createQueue(name: QueueName, connection: ConnectionOptions): Queue {
  return new Queue(name, { connection });
}

export async function enqueue<TPayload extends Record<string, unknown>>(
  queue: Queue,
  name: string,
  payload: TPayload,
  options: EnqueueOptions,
): Promise<string> {
  const envelope: JobEnvelope<TPayload> = {
    idempotencyKey: options.idempotencyKey,
    payload,
    requestId: options.requestId,
    enqueuedAt: new Date().toISOString(),
  };

  const jobOptions: JobsOptions = {
    jobId: buildJobId(options.idempotencyKey),
    attempts: options.attempts ?? DEFAULT_JOB_ATTEMPTS,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 1000,
    removeOnFail: 5000,
    delay: options.delayMs,
  };

  const job = await queue.add(name, envelope, jobOptions);
  return job.id ?? buildJobId(options.idempotencyKey);
}
