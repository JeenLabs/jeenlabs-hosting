import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export enum BillingCycleDto {
  monthly = 'monthly',
  q3 = 'q3',
  q6 = 'q6',
  q12 = 'q12',
}

export class PlanSpecsDto {
  @IsInt()
  @Min(1)
  vcpu!: number;

  @IsInt()
  @Min(256)
  ramMb!: number;

  @IsInt()
  @Min(10)
  diskGb!: number;

  @IsInt()
  @Min(1)
  bandwidthTb!: number;
}

export class PlanPriceInputDto {
  @IsEnum(BillingCycleDto)
  billingCycle!: BillingCycleDto;

  @IsInt()
  @Min(0)
  priceMinor!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  discountPct?: number;
}

export class CreateRegionDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class CreatePlanDto {
  @IsString()
  name!: string;

  @IsString()
  contaboProductId!: string;

  @IsString()
  regionId!: string;

  @ValidateNested()
  @Type(() => PlanSpecsDto)
  specs!: PlanSpecsDto;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanPriceInputDto)
  prices!: PlanPriceInputDto[];
}

export class UpsertContaboCostDto {
  @IsString()
  contaboProductId!: string;

  @IsString()
  regionId!: string;

  @IsInt()
  @Min(0)
  wholesaleMinor!: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
