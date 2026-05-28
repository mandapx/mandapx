import { IsString, IsEmail, IsOptional, IsNumber, Min, IsDateString } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  venue_slug: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsDateString()
  event_date?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  guest_count?: number;

  @IsOptional()
  @IsString()
  message?: string;
}
