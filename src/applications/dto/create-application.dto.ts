import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, IsObject } from 'class-validator';
import { ApplicationType } from '../entities/application.entity';

export class CreateApplicationDto {
  @ApiProperty({ example: 'Islom Karimov' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'client@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Mahsulot haqida maslahat kerak' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiPropertyOptional({ enum: ApplicationType, example: ApplicationType.CONTACT })
  @IsEnum(ApplicationType)
  @IsOptional()
  type?: ApplicationType;

  @ApiPropertyOptional({
    example: {
      productId: '00000000-0000-0000-0000-000000000001',
      source: 'website',
    },
  })
  @IsObject()
  @IsOptional()
  metadata?: {
    productId?: string;
    categoryId?: string;
    source?: string;
    [key: string]: any;
  };
}
