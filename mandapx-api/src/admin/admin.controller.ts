import { Controller, Get, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { VenuesService } from '../venues/venues.service';
import { InquiriesService } from '../inquiries/inquiries.service';
import { UsersService } from '../users/users.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private venuesService: VenuesService,
    private inquiriesService: InquiriesService,
    private usersService: UsersService,
  ) {}

  @Get('stats')
  async getStats() {
    const venueStats = await this.venuesService.getVenueStats();
    const inquiryStats = await this.inquiriesService.getInquiryStats();
    const userStats = await this.usersService.getUserStats();
    return { venues: venueStats, inquiries: inquiryStats, users: userStats };
  }

  @Get('venues')
  listVenues(@Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string) {
    return this.venuesService.findAllAdmin(page, limit, search);
  }

  @Patch('venues/:id/featured')
  toggleFeatured(@Param('id') id: string) {
    return this.venuesService.toggleFeatured(id);
  }

  @Delete('venues/:id')
  deleteVenue(@Param('id') id: string) {
    return this.venuesService.deleteVenue(id);
  }

  @Get('inquiries')
  listInquiries(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.inquiriesService.findAll(page, limit);
  }

  @Patch('inquiries/:id/status')
  updateInquiryStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.inquiriesService.updateStatus(id, status);
  }

  @Get('users')
  listUsers(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.usersService.findAll(page, limit);
  }

  @Patch('users/:id/role')
  updateUserRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.usersService.updateRole(id, role);
  }
}
