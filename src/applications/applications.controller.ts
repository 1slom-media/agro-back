import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiJwtAuth } from '../auth/decorators/api-jwt-auth.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Public()
  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
  }

  @ApiJwtAuth()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.applicationsService.findAll(paginationDto);
  }

  @ApiJwtAuth()
  @Get('stats')
  getStats() {
    return this.applicationsService.getStats();
  }

  @ApiJwtAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @ApiJwtAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @ApiJwtAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(id);
  }
}
