import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, ILike } from 'typeorm';
import { Venue } from './venue.entity';
import { ListVenuesDto } from './dto/list-venues.dto';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
  ) {}

  async findAll(query: ListVenuesDto) {
    const { city, state, page = 1, limit = 20, search, capacity_min, capacity_max, budget_max, venue_type, sort } = query;
    const qb = this.venuesRepository.createQueryBuilder('v').where('v.is_active = true');

    if (city) {
      qb.andWhere('LOWER(v.city) = LOWER(:city)', { city });
    }
    if (state) {
      qb.andWhere('LOWER(v.state) = LOWER(:state)', { state });
    }
    if (search) {
      qb.andWhere(
        '(LOWER(v.venue_name) LIKE LOWER(:search) OR LOWER(v.city) LIKE LOWER(:search) OR LOWER(v.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    if (capacity_min) {
      qb.andWhere('v.capacity_max >= :capacity_min', { capacity_min });
    }
    if (capacity_max) {
      qb.andWhere('v.capacity_min <= :capacity_max OR v.capacity_min IS NULL', { capacity_max });
    }
    if (budget_max) {
      qb.andWhere('v.cost_per_plate_veg <= :budget_max', { budget_max });
    }
    if (venue_type && venue_type.length > 0) {
      qb.andWhere('v.venue_type && :venue_type', { venue_type });
    }

    switch (sort) {
      case 'rating':
        qb.orderBy('v.rating', 'DESC');
        break;
      case 'price_asc':
        qb.orderBy('v.cost_per_plate_veg', 'ASC');
        break;
      case 'price_desc':
        qb.orderBy('v.cost_per_plate_veg', 'DESC');
        break;
      case 'capacity':
        qb.orderBy('v.capacity_max', 'DESC');
        break;
      case 'name':
        qb.orderBy('v.venue_name', 'ASC');
        break;
      default:
        qb.orderBy('v.rating', 'DESC');
    }

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [venues, total] = await qb.getManyAndCount();

    return {
      data: venues,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const venue = await this.venuesRepository.findOne({ where: { slug, is_active: true } });
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }
    return venue;
  }

  async findById(id: string) {
    const venue = await this.venuesRepository.findOne({ where: { id, is_active: true } });
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }
    return venue;
  }

  async getCities() {
    const result = await this.venuesRepository
      .createQueryBuilder('v')
      .select('LOWER(v.city)', 'city')
      .addSelect('COUNT(*)', 'count')
      .where('v.city IS NOT NULL AND v.city != \'\'')
      .groupBy('LOWER(v.city)')
      .orderBy('COUNT(*)', 'DESC')
      .getRawMany();
    return result.map(r => ({ city: r.city, count: parseInt(r.count, 10) }));
  }

  async getFeatured(limit = 12) {
    return this.venuesRepository.find({
      where: { is_active: true, is_featured: true },
      order: { rating: 'DESC' },
      take: limit,
    });
  }

  async getRandom(limit = 12) {
    return this.venuesRepository
      .createQueryBuilder('v')
      .where('v.is_active = true')
      .orderBy('RANDOM()')
      .take(limit)
      .getMany();
  }
}
