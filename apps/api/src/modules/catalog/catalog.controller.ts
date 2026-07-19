import { Controller, Get, Inject, Param } from '@nestjs/common';
import { Public } from '../../common/decorators/roles.decorator';
import { CatalogService } from './catalog.service';

@Controller('api/v1/catalog')
export class CatalogController {
  constructor(@Inject(CatalogService) private readonly catalog: CatalogService) {}

  @Public()
  @Get('regions')
  async regions(): Promise<{ data: unknown }> {
    return { data: await this.catalog.listRegions() };
  }

  @Public()
  @Get('plans')
  async plans(): Promise<{ data: unknown }> {
    return { data: await this.catalog.listPlans() };
  }

  @Public()
  @Get('plans/:id')
  async plan(@Param('id') id: string): Promise<{ data: unknown }> {
    return { data: await this.catalog.getPlan(id) };
  }

  @Public()
  @Get('templates')
  async templates(): Promise<{ data: unknown }> {
    return { data: await this.catalog.listTemplates() };
  }

  @Public()
  @Get('images')
  async images(): Promise<{ data: unknown }> {
    return { data: await this.catalog.listImages() };
  }
}
