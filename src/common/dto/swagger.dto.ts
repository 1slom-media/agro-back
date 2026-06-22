import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MultilingualStringDto {
  @ApiProperty({ example: 'Mahsulot nomi' })
  @IsString()
  @IsNotEmpty()
  uz: string;

  @ApiProperty({ example: 'Название товара' })
  @IsString()
  @IsNotEmpty()
  ru: string;

  @ApiProperty({ example: 'Product name' })
  @IsString()
  @IsNotEmpty()
  en: string;
}

export class ImageDataDto {
  @ApiPropertyOptional({
    example: '',
    description: 'Base64 data URI. Backend uploads to MinIO and stores URL only.',
  })
  @IsString()
  @IsOptional()
  base64?: string;

  @ApiPropertyOptional({
    example: 'http://localhost:9000/agro-products/products/example.jpg',
  })
  @IsString()
  @IsOptional()
  url?: string;
}
