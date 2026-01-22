import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsObject,
  IsArray,
  IsUUID,
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

class ImageData {
  @IsString()
  @IsOptional()
  base64?: string;

  @IsString()
  @IsOptional()
  url?: string;
}

class ProductImages {
  @ValidateNested()
  @Type(() => ImageData)
  @IsOptional()
  image1?: ImageData;

  @ValidateNested()
  @Type(() => ImageData)
  @IsOptional()
  image2?: ImageData;

  @ValidateNested()
  @Type(() => ImageData)
  @IsOptional()
  image3?: ImageData;
}

export class CreateProductDto {
  @ValidateNested()
  @Type(() => MultilingualString)
  name: MultilingualString;

  @ValidateNested()
  @Type(() => MultilingualString)
  description: MultilingualString;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @ValidateNested()
  @Type(() => ProductImages)
  @IsOptional()
  images?: ProductImages;

  // Deprecated: kept for backward compatibility
  @IsString()
  @IsOptional()
  imageBase64?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsObject()
  @IsOptional()
  specifications?: {
    temperature?: string;
    density?: string;
    width?: string;
    length?: string;
    [key: string]: any;
  };

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

