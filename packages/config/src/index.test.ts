import { describe, expect, it } from 'vitest';
import { loadEnv, parseAllowedOrigins } from './index';

describe('config', () => {
  it('parses allowed origins', () => {
    expect(parseAllowedOrigins('http://localhost:3000, https://app.example')).toEqual([
      'http://localhost:3000',
      'https://app.example',
    ]);
  });

  it('rejects short auth secrets', () => {
    expect(() =>
      loadEnv({
        DATABASE_URL: 'postgres://app:app@localhost:5432/app',
        REDIS_URL: 'redis://localhost:6379',
        BETTER_AUTH_SECRET: 'too-short',
        BETTER_AUTH_URL: 'http://localhost:4000',
      }),
    ).toThrow(/BETTER_AUTH_SECRET/);
  });

  it('loads a valid env', () => {
    const env = loadEnv({
      DATABASE_URL: 'postgres://app:app@localhost:5432/app',
      REDIS_URL: 'redis://localhost:6379',
      BETTER_AUTH_SECRET: 'x'.repeat(32),
      BETTER_AUTH_URL: 'http://localhost:4000',
      ALLOWED_ORIGINS: 'http://localhost:3000',
      API_PORT: '4000',
    });
    expect(env.API_PORT).toBe(4000);
  });
});
