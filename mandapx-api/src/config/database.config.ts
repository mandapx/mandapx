import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    ssl: process.env.DATABASE_URL?.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : false,
  };
}
