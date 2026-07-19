import { Global, Module } from '@nestjs/common';
import { parseAllowedOrigins } from '@app/config';
import { PrismaService } from '../prisma/prisma.service';
import { BETTER_AUTH, createBetterAuth } from './better-auth';

@Global()
@Module({
  providers: [
    {
      provide: BETTER_AUTH,
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => {
        const secret = process.env.BETTER_AUTH_SECRET;
        const baseURL = process.env.BETTER_AUTH_URL;
        if (!secret || secret.length < 32) {
          throw new Error('BETTER_AUTH_SECRET must be at least 32 characters');
        }
        if (!baseURL) {
          throw new Error('BETTER_AUTH_URL is required');
        }
        return createBetterAuth(prisma, {
          secret,
          baseURL,
          trustedOrigins: parseAllowedOrigins(
            process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000',
          ),
        });
      },
    },
  ],
  exports: [BETTER_AUTH],
})
export class BetterAuthModule {}
