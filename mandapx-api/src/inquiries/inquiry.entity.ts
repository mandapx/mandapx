import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 255 })
  venue_slug: string;

  @Column({ length: 255, nullable: true })
  venue_name: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ type: 'date', nullable: true })
  event_date: string;

  @Column({ nullable: true })
  guest_count: number;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  updated_at: Date;
}
