import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ListVenuesDto } from './dto/list-venues.dto';

interface VenueData {
  venue_name: string;
  slug: string;
  description?: string;
  address?: string;
  pin_code?: string;
  city?: string;
  state?: string;
  country?: string;
  capacity_max?: number;
  cost_per_plate_veg?: number;
  cost_per_plate_nonveg?: number;
  venue_type?: string[];
  amenities?: string[];
  images?: string[];
  rating?: number;
  reviews_count?: number;
  source?: string;
  source_url?: string;
}

@Injectable()
export class VenuesServiceMock {
  private venues: (VenueData & { id: string; is_active: boolean; is_featured: boolean; is_verified: boolean })[] = [];
  private loaded = false;

  private load() {
    if (this.loaded) return;
    try {
      const jsonPath = path.join(__dirname, '..', '..', '..', 'learning', 'output', 'venues-combined.json');
      if (fs.existsSync(jsonPath)) {
        const data: VenueData[] = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        this.venues = data.map((v, i) => ({
          ...v,
          id: String(i + 1),
          is_active: true,
          is_featured: (v.rating || 0) >= 4,
          is_verified: false,
        }));
        console.log(`Mock service loaded ${this.venues.length} venues`);
      }
    } catch (err) {
      console.warn('Mock service could not load venues:', (err as Error).message);
    }
    this.loaded = true;
  }

  async findAll(query: ListVenuesDto) {
    this.load();
    let result = [...this.venues];

    if (query.city) {
      result = result.filter(v => v.city?.toLowerCase() === query.city!.toLowerCase());
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      result = result.filter(v =>
        v.venue_name?.toLowerCase().includes(s) ||
        v.city?.toLowerCase().includes(s) ||
        v.description?.toLowerCase().includes(s)
      );
    }
    if (query.venue_type && query.venue_type.length > 0) {
      result = result.filter(v =>
        v.venue_type?.some(t => query.venue_type!.includes(t))
      );
    }
    if (query.capacity_min) {
      result = result.filter(v => (v.capacity_max || 0) >= query.capacity_min!);
    }
    if (query.budget_max) {
      result = result.filter(v => (v.cost_per_plate_veg || 0) <= query.budget_max!);
    }

    const total = result.length;
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const data = result.slice(skip, skip + limit);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    this.load();
    const venue = this.venues.find(v => v.slug === slug);
    if (!venue) throw new Error('Venue not found');
    return venue;
  }

  async getCities() {
    this.load();
    const cityMap = new Map<string, number>();
    this.venues.forEach(v => {
      const c = v.city?.toLowerCase();
      if (c) cityMap.set(c, (cityMap.get(c) || 0) + 1);
    });
    return Array.from(cityMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 100);
  }

  async getFeatured(limit = 12) {
    this.load();
    return this.venues.filter(v => v.is_featured).slice(0, limit);
  }

  async getRandom(limit = 12) {
    this.load();
    const shuffled = [...this.venues].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }
}
