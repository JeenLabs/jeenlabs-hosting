import { Inject, Injectable } from '@nestjs/common';
import type { BillingCycle, Prisma } from '@app/db';
import { ErrorCode } from '@app/types';
import type Redis from 'ioredis';
import { AppException } from '../../common/errors/app.exception';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { REDIS_CACHE } from '../../infra/redis/redis.module';

const PLANS_CACHE_KEY = 'cache:plans:all';
const PLANS_CACHE_TTL_SECONDS = 60;

export interface PlanSpecs {
  vcpu: number;
  ramMb: number;
  diskGb: number;
  bandwidthTb: number;
}

@Injectable()
export class CatalogService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(REDIS_CACHE) private readonly cache: Redis,
  ) {}

  async listRegions(includeDisabled = false) {
    return this.prisma.region.findMany({
      where: includeDisabled ? undefined : { enabled: true },
      orderBy: { code: 'asc' },
    });
  }

  async listPlans(includeDisabled = false) {
    if (!includeDisabled) {
      const cached = await this.cache.get(PLANS_CACHE_KEY).catch(() => null);
      if (cached) {
        return JSON.parse(cached) as unknown;
      }
    }

    const plans = await this.prisma.plan.findMany({
      where: includeDisabled ? undefined : { enabled: true },
      include: {
        region: true,
        prices: { orderBy: { billingCycle: 'asc' } },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    if (!includeDisabled) {
      await this.cache
        .set(PLANS_CACHE_KEY, JSON.stringify(plans), 'EX', PLANS_CACHE_TTL_SECONDS)
        .catch(() => undefined);
    }

    return plans;
  }

  async getPlan(id: string, includeDisabled = false) {
    const plan = await this.prisma.plan.findFirst({
      where: includeDisabled ? { id } : { id, enabled: true },
      include: {
        region: true,
        prices: { orderBy: { billingCycle: 'asc' } },
      },
    });
    if (!plan) {
      throw new AppException(ErrorCode.RESOURCE_NOT_FOUND, 'Plan not found', 404);
    }
    return plan;
  }

  async listTemplates(includeDisabled = false) {
    return this.prisma.appTemplate.findMany({
      where: includeDisabled ? undefined : { enabled: true },
      include: { requiredImage: true },
      orderBy: { name: 'asc' },
    });
  }

  async listImages(includeDisabled = false) {
    return this.prisma.osImage.findMany({
      where: includeDisabled ? undefined : { enabled: true },
      orderBy: { name: 'asc' },
    });
  }

  async createRegion(input: { code: string; name: string; enabled?: boolean }) {
    const region = await this.prisma.region.create({
      data: {
        code: input.code.toUpperCase(),
        name: input.name,
        enabled: input.enabled ?? true,
      },
    });
    await this.bustPlanCache();
    return region;
  }

  async createPlan(input: {
    name: string;
    contaboProductId: string;
    regionId: string;
    specs: PlanSpecs;
    enabled?: boolean;
    sortOrder?: number;
    prices: Array<{
      billingCycle: BillingCycle;
      priceMinor: number;
      currency?: string;
      discountPct?: number;
    }>;
  }) {
    const region = await this.prisma.region.findUnique({ where: { id: input.regionId } });
    if (!region) {
      throw new AppException(ErrorCode.VALIDATION_ERROR, 'Invalid regionId', 400);
    }

    const plan = await this.prisma.plan.create({
      data: {
        name: input.name,
        contaboProductId: input.contaboProductId,
        regionId: input.regionId,
        specs: input.specs as unknown as Prisma.InputJsonValue,
        enabled: input.enabled ?? true,
        sortOrder: input.sortOrder ?? 0,
        prices: {
          create: input.prices.map((price) => ({
            billingCycle: price.billingCycle,
            priceMinor: price.priceMinor,
            currency: price.currency ?? 'INR',
            discountPct: price.discountPct ?? 0,
          })),
        },
      },
      include: { region: true, prices: true },
    });
    await this.bustPlanCache();
    return plan;
  }

  async upsertContaboCost(input: {
    contaboProductId: string;
    regionId: string;
    wholesaleMinor: number;
    currency?: string;
  }) {
    return this.prisma.contaboCost.upsert({
      where: {
        contaboProductId_regionId: {
          contaboProductId: input.contaboProductId,
          regionId: input.regionId,
        },
      },
      create: {
        contaboProductId: input.contaboProductId,
        regionId: input.regionId,
        wholesaleMinor: input.wholesaleMinor,
        currency: input.currency ?? 'EUR',
        fetchedAt: new Date(),
      },
      update: {
        wholesaleMinor: input.wholesaleMinor,
        currency: input.currency ?? 'EUR',
        fetchedAt: new Date(),
      },
    });
  }

  computeMarginMinor(priceMinor: number, wholesaleMinor: number): number {
    return priceMinor - wholesaleMinor;
  }

  private async bustPlanCache(): Promise<void> {
    await this.cache.del(PLANS_CACHE_KEY).catch(() => undefined);
  }
}
