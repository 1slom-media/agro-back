import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsObject,
  IsArray,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MultilingualStringDto } from '../../common/dto/swagger.dto';

export class CreateBlogPostDto {
  @ApiProperty({ type: MultilingualStringDto })
  @ValidateNested()
  @Type(() => MultilingualStringDto)
  title: MultilingualStringDto;

  @ApiProperty({ type: MultilingualStringDto })
  @ValidateNested()
  @Type(() => MultilingualStringDto)
  content: MultilingualStringDto;

  @ApiPropertyOptional({ type: MultilingualStringDto })
  @ValidateNested()
  @Type(() => MultilingualStringDto)
  @IsOptional()
  excerpt?: MultilingualStringDto;

  @ApiProperty({ example: 'agrovolokno-qollanma' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({
    description: 'Base64 image. Backend uploads to MinIO and stores featuredImageUrl.',
  })
  @IsString()
  @IsOptional()
  featuredImageBase64?: string;

  @ApiPropertyOptional({
    example: 'http://localhost:9000/agro-products/blog/example.jpg',
  })
  @IsString()
  @IsOptional()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    example: {
      keywords: ['agrovolokno', 'qoplam'],
      ogImage: 'http://localhost:9000/agro-products/blog/example.jpg',
    },
  })
  @IsObject()
  @IsOptional()
  seo?: {
    metaTitle?: { uz: string; ru: string; en: string };
    metaDescription?: { uz: string; ru: string; en: string };
    keywords?: string[];
    ogImage?: string;
  };

  @ApiPropertyOptional({ example: ['agrovolokno', 'tips'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({ example: '2026-01-12T10:00:00.000Z' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  publishedAt?: Date;

  @ApiPropertyOptional({ example: '00000000-0000-0000-0000-000000000001' })
  @IsString()
  @IsOptional()
  authorId?: string;

  @ApiPropertyOptional({ example: 'https://www.youtube.com/watch?v=example' })
  @IsString()
  @IsOptional()
  youtubeLink?: string;
}
