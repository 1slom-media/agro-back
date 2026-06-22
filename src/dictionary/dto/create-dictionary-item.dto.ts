import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { DictionaryType } from '../entities/dictionary-item.entity';
import { MultilingualStringDto } from '../../common/dto/swagger.dto';

export class CreateDictionaryItemDto {
  @ApiProperty({ enum: DictionaryType, example: DictionaryType.COLOR })
  @IsEnum(DictionaryType)
  type: DictionaryType;

  @ApiProperty({ example: 'white' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ type: MultilingualStringDto })
  @ValidateNested()
  @Type(() => MultilingualStringDto)
  label: MultilingualStringDto;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;
}
