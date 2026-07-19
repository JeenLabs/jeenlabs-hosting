import { describe, expect, it } from 'vitest';
import { buildJobId, DEFAULT_JOB_ATTEMPTS, QUEUE_NAMES } from './types';

describe('queue contracts', () => {
  it('exposes required queue names', () => {
    expect(QUEUE_NAMES.PROVISIONING).toBe('provisioning');
    expect(QUEUE_NAMES.BILLING).toBe('billing');
  });

  it('builds stable job ids from idempotency keys', () => {
    expect(buildJobId('order_1')).toBe('job_order_1');
  });

  it('defaults to retryable attempts', () => {
    expect(DEFAULT_JOB_ATTEMPTS).toBeGreaterThan(1);
  });
});
