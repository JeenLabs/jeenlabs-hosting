export const QUEUE_NAMES = {
  PROVISIONING: 'provisioning',
  BILLING: 'billing',
  EMAIL: 'email',
  SCHEDULED: 'scheduled',
  EXPORTS: 'exports',
  PAYOUTS: 'payouts',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export type JobStatus = 'queued' | 'active' | 'completed' | 'failed' | 'dead';

export interface JobEnvelope<TPayload = Record<string, unknown>> {
  idempotencyKey: string;
  payload: TPayload;
  requestId?: string;
  enqueuedAt: string;
}

export interface EnqueueOptions {
  idempotencyKey: string;
  requestId?: string;
  delayMs?: number;
  attempts?: number;
}

export const DEFAULT_JOB_ATTEMPTS = 5;

export function buildJobId(idempotencyKey: string): string {
  return `job_${idempotencyKey}`;
}
