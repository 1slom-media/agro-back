import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { DictionaryType } from '../entities/dictionary-item.entity';

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

export class CreateDictionaryItemDto {
  @IsEnum(DictionaryType)
  type: DictionaryType;

  @IsString()
  @IsNotEmpty()
  value: string;

  @ValidateNested()
  @Type(() => MultilingualString)
  label: MultilingualString;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}


