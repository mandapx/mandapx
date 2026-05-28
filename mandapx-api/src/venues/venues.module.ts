import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venue } from './venue.entity';
import { VenuesController } from './venues.controller';
import { VenuesService } from './venues.service';
import { VenuesServiceMock } from './venues.service.mock';

const useDatabase = !!process.env.DATABASE_URL;

@Module({
  imports: useDatabase ? [TypeOrmModule.forFeature([Venue])] : [],
  controllers: [VenuesController],
  providers: [
    {
      provide: 'VenuesServiceInterface',
      useClass: useDatabase ? VenuesService : VenuesServiceMock,
    },
  ],
  exports: ['VenuesServiceInterface'],
})
export class VenuesModule {}
