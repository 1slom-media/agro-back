import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { ImageDataDto, MultilingualStringDto } from '../../common/dto/swagger.dto';

class ProductImages {
  @ApiPropertyOptional({ type: ImageDataDto })
  @ValidateNested()
  @Type(() => ImageDataDto)
  @IsOptional()
  image1?: ImageDataDto;

  @ApiPropertyOptional({ type: ImageDataDto })
  @ValidateNested()
  @Type(() => ImageDataDto)
  @IsOptional()
  image2?: ImageDataDto;

  @ApiPropertyOptional({ type: ImageDataDto })
  @ValidateNested()
  @Type(() => ImageDataDto)
  @IsOptional()
  image3?: ImageDataDto;
}

export class CreateProductDto {
  @ApiProperty({ type: MultilingualStringDto })
  @ValidateNested()
  @Type(() => MultilingualStringDto)
  name: MultilingualStringDto;

  @ApiProperty({ type: MultilingualStringDto })
  @ValidateNested()
  @Type(() => MultilingualStringDto)
  description: MultilingualStringDto;

  @ApiProperty({ example: 'agrovolokno-17-white' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 40000 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ type: ProductImages })
  @ValidateNested()
  @Type(() => ProductImages)
  @IsOptional()
  images?: ProductImages;

  @ApiPropertyOptional({ description: 'Deprecated. Use images.image1.url instead.' })
  @IsString()
  @IsOptional()
  imageBase64?: string;

  @ApiPropertyOptional({ example: 'http://localhost:9000/agro-products/products/example.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: {
      temperature: '-2',
      density: '17',
      color: 'white',
      size: '1.6x10',
      sellType: 'za_paket',
      usage: ['open_field'],
    },
  })
  @IsObject()
  @IsOptional()
  specifications?: {
    temperature?: string;
    density?: string;
    width?: string;
    length?: string;
    [key: string]: any;
  };

  @ApiProperty({ example: '00000000-0000-0000-0000-000000000001' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: ['agrovolokno', 'cover'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
