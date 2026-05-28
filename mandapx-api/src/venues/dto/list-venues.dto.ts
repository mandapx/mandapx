import { IsOptional, IsString, IsNumber, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ListVenuesDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  capacity_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  capacity_max?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  budget_max?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  venue_type?: string[];

  @IsOptional()
  @IsString()
  sort?: 'rating' | 'price_asc' | 'price_desc' | 'capacity' | 'name';
}
