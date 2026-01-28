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

class MultilingualString {
  @IsString()
  @IsNotEmpty()
  uz: string;

  @IsString()
  @IsNotEmpty()
  ru: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}

export class CreateBlogPostDto {
  @ValidateNested()
  @Type(() => MultilingualString)
  title: MultilingualString;

  @ValidateNested()
  @Type(() => MultilingualString)
  content: MultilingualString;

  @ValidateNested()
  @Type(() => MultilingualString)
  @IsOptional()
  excerpt?: MultilingualString;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  featuredImageBase64?: string;

  @IsString()
  @IsOptional()
  featuredImageUrl?: string;

  @IsObject()
  @IsOptional()
  seo?: {
    metaTitle?: { uz: string; ru: string; en: string };
    metaDescription?: { uz: string; ru: string; en: string };
    keywords?: string[];
    ogImage?: string;
  };

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  publishedAt?: Date;

  @IsString()
  @IsOptional()
  authorId?: string;

  @IsString()
  @IsOptional()
  youtubeLink?: string;
}

