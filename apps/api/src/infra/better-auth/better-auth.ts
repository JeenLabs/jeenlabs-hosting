import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import type { PrismaClient } from '@app/db';

export function createBetterAuth(
  prisma: PrismaClient,
  options: {
    secret: string;
    baseURL: string;
    trustedOrigins: string[];
  },
) {
  return betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    secret: options.secret,
    baseURL: options.baseURL,
    trustedOrigins: options.trustedOrigins,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },
    advanced: {
      cookiePrefix: 'jl',
      useSecureCookies: process.env.NODE_ENV === 'production',
    },
  });
}

export type BetterAuthInstance = ReturnType<typeof createBetterAuth>;

export const BETTER_AUTH = 'BETTER_AUTH';
