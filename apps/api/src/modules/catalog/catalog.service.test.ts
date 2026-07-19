import { describe, expect, it } from 'vitest';
import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  it('computes margin as price minus wholesale', () => {
    const service = Object.create(CatalogService.prototype) as CatalogService;
    expect(service.computeMarginMinor(120_00, 40_00)).toBe(80_00);
    expect(service.computeMarginMinor(1000, 1000)).toBe(0);
  });
});
