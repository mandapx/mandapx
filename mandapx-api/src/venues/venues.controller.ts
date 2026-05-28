import { Controller, Get, Param, Query, Inject } from '@nestjs/common';
import { ListVenuesDto } from './dto/list-venues.dto';

export interface IVenuesService {
  findAll(query: ListVenuesDto): Promise<any>;
  findBySlug(slug: string): Promise<any>;
  getCities(): Promise<any>;
  getFeatured(limit?: number): Promise<any>;
  getRandom(limit?: number): Promise<any>;
}

@Controller('venues')
export class VenuesController {
  constructor(@Inject('VenuesServiceInterface') private readonly venuesService: IVenuesService) {}

  @Get()
  findAll(@Query() query: ListVenuesDto) {
    return this.venuesService.findAll(query);
  }

  @Get('cities')
  getCities() {
    return this.venuesService.getCities();
  }

  @Get('featured')
  getFeatured() {
    return this.venuesService.getFeatured();
  }

  @Get('random')
  getRandom() {
    return this.venuesService.getRandom();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.venuesService.findBySlug(slug);
  }
}
