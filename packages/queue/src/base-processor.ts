import { Worker, type ConnectionOptions, type Job, type Processor } from 'bullmq';
import type { JobEnvelope, QueueName } from './types';

export interface BaseProcessorHooks<TPayload extends Record<string, unknown>> {
  onStart?: (job: Job<JobEnvelope<TPayload>>) => Promise<void> | void;
  onSuccess?: (job: Job<JobEnvelope<TPayload>>) => Promise<void> | void;
  onFailure?: (job: Job<JobEnvelope<TPayload>>, error: unknown) => Promise<void> | void;
  onDeadLetter?: (job: Job<JobEnvelope<TPayload>>, error: unknown) => Promise<void> | void;
}

/**
 * Shared worker contract: idempotent jobs, retries, DLQ hooks, status/audit callbacks.
 */
export function createBaseProcessor<TPayload extends Record<string, unknown>>(
  handler: (job: Job<JobEnvelope<TPayload>>) => Promise<void>,
  hooks: BaseProcessorHooks<TPayload> = {},
): Processor<JobEnvelope<TPayload>> {
  return async (job) => {
    await hooks.onStart?.(job);
    try {
      await handler(job);
      await hooks.onSuccess?.(job);
    } catch (error) {
      await hooks.onFailure?.(job, error);
      const maxAttempts = job.opts.attempts ?? 1;
      if (job.attemptsMade + 1 >= maxAttempts) {
        await hooks.onDeadLetter?.(job, error);
      }
      throw error;
    }
  };
}

export function createWorker<TPayload extends Record<string, unknown>>(
  queueName: QueueName,
  connection: ConnectionOptions,
  processor: Processor<JobEnvelope<TPayload>>,
  concurrency = 5,
): Worker<JobEnvelope<TPayload>> {
  return new Worker(queueName, processor, { connection, concurrency });
}
