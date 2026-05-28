import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  venue_name: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 20, nullable: true })
  pin_code: string;

  @Index()
  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, default: 'India' })
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  capacity_min: number;

  @Column({ nullable: true })
  capacity_max: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost_per_plate_veg: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost_per_plate_nonveg: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost_per_day: number;

  @Column({ type: 'text', array: true, nullable: true })
  venue_type: string[];

  @Column({ type: 'text', array: true, nullable: true })
  amenities: string[];

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviews_count: number;

  @Column({ length: 100, nullable: true })
  source: string;

  @Column({ type: 'text', nullable: true, unique: true })
  source_url: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: false })
  is_featured: boolean;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  updated_at: Date;
}
