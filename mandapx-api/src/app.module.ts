import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { VenuesModule } from './venues/venues.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { getDatabaseConfig } from './config/database.config';

const useDatabase = !!process.env.DATABASE_URL;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...(useDatabase ? [TypeOrmModule.forRoot(getDatabaseConfig())] : []),
    VenuesModule,
    InquiriesModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
