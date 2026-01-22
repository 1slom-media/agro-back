import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly telegramService: TelegramService,
  ) {}

  async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
    const application = this.applicationRepository.create(createApplicationDto);
    const savedApplication = await this.applicationRepository.save(application);
    
    // Send Telegram notification
    try {
      await this.telegramService.sendNewApplicationNotification(savedApplication);
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
      // Don't fail the request if Telegram fails
    }
    
    return savedApplication;
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResult<Application>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.applicationRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({ where: { id } });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return application;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    const application = await this.findOne(id);
    Object.assign(application, updateApplicationDto);
    return this.applicationRepository.save(application);
  }

  async remove(id: string): Promise<void> {
    const application = await this.findOne(id);
    await this.applicationRepository.remove(application);
  }

  async getStats() {
    const total = await this.applicationRepository.count();
    const newCount = await this.applicationRepository.count({ where: { status: ApplicationStatus.NEW } });
    const inProgressCount = await this.applicationRepository.count({ where: { status: ApplicationStatus.IN_PROGRESS } });
    const completedCount = await this.applicationRepository.count({ where: { status: ApplicationStatus.COMPLETED } });
    const unreadCount = await this.applicationRepository.count({ where: { isRead: false } });

    return {
      total,
      new: newCount,
      inProgress: inProgressCount,
      completed: completedCount,
      unread: unreadCount,
    };
  }
}
