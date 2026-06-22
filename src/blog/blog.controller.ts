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
import { BlogService } from './blog.service';

import { CreateBlogPostDto } from './dto/create-blog-post.dto';

import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

import { PaginationDto } from '../common/dto/pagination.dto';

import { ApiJwtAuth } from '../auth/decorators/api-jwt-auth.decorator';

import { Public } from '../auth/decorators/public.decorator';



@ApiTags('Blog')
@Controller('blog')

export class BlogController {

  constructor(private readonly blogService: BlogService) {}



  @ApiJwtAuth()

  @Post()

  create(@Body() createBlogPostDto: CreateBlogPostDto) {

    return this.blogService.create(createBlogPostDto);

  }



  @Public()

  @Get()

  findAll(@Query() paginationDto: PaginationDto) {

    return this.blogService.findAll(paginationDto);

  }



  @ApiJwtAuth()

  @Post('migrate-images')

  migrateImages() {

    return this.blogService.migrateAllImagesToMinio();

  }



  @Public()

  @Get(':id')

  findOne(@Param('id') id: string) {

    return this.blogService.findOne(id);

  }



  @Public()

  @Get('slug/:slug')

  findBySlug(@Param('slug') slug: string) {

    return this.blogService.findBySlug(slug);

  }



  @ApiJwtAuth()

  @Patch(':id')

  update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {

    return this.blogService.update(id, updateBlogPostDto);

  }



  @ApiJwtAuth()

  @Delete(':id')

  remove(@Param('id') id: string) {

    return this.blogService.remove(id);

  }

}


