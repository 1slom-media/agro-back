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
import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';

import { UpdateProductDto } from './dto/update-product.dto';

import { PaginationDto } from '../common/dto/pagination.dto';

import { ApiJwtAuth } from '../auth/decorators/api-jwt-auth.decorator';

import { Public } from '../auth/decorators/public.decorator';



@ApiTags('Products')
@Controller('products')

export class ProductsController {

  constructor(private readonly productsService: ProductsService) {}



  @ApiJwtAuth()

  @Post()

  create(@Body() createProductDto: CreateProductDto) {

    return this.productsService.create(createProductDto);

  }



  @Public()

  @Get()

  findAll(@Query() paginationDto: PaginationDto) {

    return this.productsService.findAll(paginationDto);

  }



  @Public()

  @Get('category/:categoryId')

  findByCategory(

    @Param('categoryId') categoryId: string,

    @Query() paginationDto: PaginationDto,

  ) {

    return this.productsService.findByCategory(categoryId, paginationDto);

  }



  @ApiJwtAuth()

  @Post('migrate-images')

  migrateImages() {

    return this.productsService.migrateAllImagesToMinio();

  }



  @Public()

  @Get(':id')

  findOne(@Param('id') id: string) {

    return this.productsService.findOne(id);

  }



  @Public()

  @Get('slug/:slug')

  findBySlug(@Param('slug') slug: string) {

    return this.productsService.findBySlug(slug);

  }



  @ApiJwtAuth()

  @Patch(':id')

  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {

    return this.productsService.update(id, updateProductDto);

  }



  @ApiJwtAuth()

  @Delete(':id')

  remove(@Param('id') id: string) {

    return this.productsService.remove(id);

  }

}


