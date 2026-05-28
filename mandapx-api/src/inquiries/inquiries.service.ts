import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from './inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private inquiriesRepository: Repository<Inquiry>,
  ) {}

  async create(dto: CreateInquiryDto): Promise<Inquiry> {
    const inquiry = this.inquiriesRepository.create(dto);
    return this.inquiriesRepository.save(inquiry);
  }

  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.inquiriesRepository.findAndCount({
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Inquiry> {
    const inquiry = await this.inquiriesRepository.findOne({ where: { id } });
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }
}
