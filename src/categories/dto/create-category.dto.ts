import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, ValidateNested } from 'class-validator';
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

export class CreateCategoryDto {
  @ValidateNested()
  @Type(() => MultilingualString)
  name: MultilingualString;

  @ValidateNested()
  @Type(() => MultilingualString)
  @IsOptional()
  description?: MultilingualString;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @ValidateNested()
  @Type(() => ImageData)
  @IsOptional()
  image?: ImageData;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}

