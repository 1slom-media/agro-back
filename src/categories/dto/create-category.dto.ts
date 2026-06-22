import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ImageDataDto, MultilingualStringDto } from '../../common/dto/swagger.dto';

export class CreateCategoryDto {
  @ApiProperty({ type: MultilingualStringDto })
  @ValidateNested()
  @Type(() => MultilingualStringDto)
  name: MultilingualStringDto;

  @ApiPropertyOptional({ type: MultilingualStringDto })
  @ValidateNested()
  @Type(() => MultilingualStringDto)
  @IsOptional()
  description?: MultilingualStringDto;

  @ApiProperty({ example: 'agrovolokno' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ type: ImageDataDto })
  @ValidateNested()
  @Type(() => ImageDataDto)
  @IsOptional()
  image?: ImageDataDto;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;
}
