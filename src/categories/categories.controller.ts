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

import { ApiTags } from '@nestjs/swagger';

import { CategoriesService } from './categories.service';

import { CreateCategoryDto } from './dto/create-category.dto';

import { UpdateCategoryDto } from './dto/update-category.dto';

import { PaginationDto } from '../common/dto/pagination.dto';

import { ApiJwtAuth } from '../auth/decorators/api-jwt-auth.decorator';

import { Public } from '../auth/decorators/public.decorator';



@ApiTags('Categories')
@Controller('categories')

export class CategoriesController {

  constructor(private readonly categoriesService: CategoriesService) {}



  @ApiJwtAuth()

  @Post()

  create(@Body() createCategoryDto: CreateCategoryDto) {

    return this.categoriesService.create(createCategoryDto);

  }



  @Public()

  @Get()

  findAll(@Query() paginationDto: PaginationDto) {

    return this.categoriesService.findAll(paginationDto);

  }



  @ApiJwtAuth()

  @Post('migrate-images')

  migrateImages() {

    return this.categoriesService.migrateAllImagesToMinio();

  }



  @Public()

  @Get(':id')

  findOne(@Param('id') id: string) {

    return this.categoriesService.findOne(id);

  }



  @Public()

  @Get('slug/:slug')

  findBySlug(@Param('slug') slug: string) {

    return this.categoriesService.findBySlug(slug);

  }



  @ApiJwtAuth()

  @Patch(':id')

  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {

    return this.categoriesService.update(id, updateCategoryDto);

  }



  @ApiJwtAuth()

  @Delete(':id')

  remove(@Param('id') id: string) {

    return this.categoriesService.remove(id);

  }

}


