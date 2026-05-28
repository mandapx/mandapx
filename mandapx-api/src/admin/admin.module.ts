import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { VenuesModule } from '../venues/venues.module';
import { InquiriesModule } from '../inquiries/inquiries.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [VenuesModule, InquiriesModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}
