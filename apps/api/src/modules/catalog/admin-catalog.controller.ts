import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { StaffRoleName } from '@app/types';
import { Roles } from '../../common/decorators/roles.decorator';
import { CatalogService } from './catalog.service';
import { CreatePlanDto, CreateRegionDto, UpsertContaboCostDto } from './dto/catalog.dto';

@Controller('api/v1/admin/catalog')
@Roles(StaffRoleName.SUPER_ADMIN)
export class AdminCatalogController {
  constructor(@Inject(CatalogService) private readonly catalog: CatalogService) {}

  @Get('plans')
  async plans(): Promise<{ data: unknown }> {
    return { data: await this.catalog.listPlans(true) };
  }

  @Get('regions')
  async regions(): Promise<{ data: unknown }> {
    return { data: await this.catalog.listRegions(true) };
  }

  @Get('templates')
  async templates(): Promise<{ data: unknown }> {
    return { data: await this.catalog.listTemplates(true) };
  }

  @Post('regions')
  async createRegion(@Body() body: CreateRegionDto): Promise<{ data: unknown }> {
    return { data: await this.catalog.createRegion(body) };
  }

  @Post('plans')
  async createPlan(@Body() body: CreatePlanDto): Promise<{ data: unknown }> {
    return { data: await this.catalog.createPlan(body) };
  }

  @Post('costs')
  async upsertCost(@Body() body: UpsertContaboCostDto): Promise<{ data: unknown }> {
    return { data: await this.catalog.upsertContaboCost(body) };
  }
}
