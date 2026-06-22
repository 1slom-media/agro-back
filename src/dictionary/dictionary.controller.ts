import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { ApiJwtAuth } from '../auth/decorators/api-jwt-auth.decorator';
import { DictionaryService } from './dictionary.service';
import { DictionaryType } from './entities/dictionary-item.entity';
import { CreateDictionaryItemDto } from './dto/create-dictionary-item.dto';
import { UpdateDictionaryItemDto } from './dto/update-dictionary-item.dto';

@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  // Client needs everything for filters
  @Public()
  @Get('filters')
  getFilters() {
    return this.dictionaryService.getFilters();
  }

  // Public lists (backward compatible paths)
  @Public()
  @Get('temperature')
  getTemperatureOptions() {
    return this.dictionaryService.list(DictionaryType.TEMPERATURE, true);
  }

  @Public()
  @Get('density')
  getDensityOptions() {
    return this.dictionaryService.list(DictionaryType.DENSITY, true);
  }

  @Public()
  @Get('width')
  getWidthOptions() {
    return this.dictionaryService.list(DictionaryType.SIZE, true);
  }

  @Public()
  @Get('length')
  getLengthOptions() {
    return this.dictionaryService.list(DictionaryType.LENGTH, true);
  }

  @Public()
  @Get('color')
  getColorOptions() {
    return this.dictionaryService.list(DictionaryType.COLOR, true);
  }

  // CRUD (admin)
  @ApiJwtAuth()
  @Get()
  findAll() {
    return this.dictionaryService.findAll();
  }

  @ApiJwtAuth()
  @Post()
  create(@Body() dto: CreateDictionaryItemDto) {
    return this.dictionaryService.create(dto);
  }

  @ApiJwtAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDictionaryItemDto) {
    return this.dictionaryService.update(id, dto);
  }

  @ApiJwtAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dictionaryService.remove(id);
  }

  // Convenience list-by-type (admin + client)
  @Public()
  @Get('type/:type')
  listByType(@Param('type') type: DictionaryType, @Query('all') all?: string) {
    const onlyActive = all !== 'true';
    return this.dictionaryService.list(type, onlyActive);
  }
}
