import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListVenuesDto } from './dto/list-venues.dto';
import { VenuesService } from './venues.service';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

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
