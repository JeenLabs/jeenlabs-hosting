import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@app/types';
import { AppException } from './app.exception';

describe('AppException', () => {
  it('carries canonical error metadata', () => {
    const error = new AppException(ErrorCode.FORBIDDEN, 'denied', 403);
    expect(error.code).toBe(ErrorCode.FORBIDDEN);
    expect(error.httpStatus).toBe(403);
    expect(error.message).toBe('denied');
  });
});
