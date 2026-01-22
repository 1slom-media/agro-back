import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, IsObject } from 'class-validator';
import { ApplicationType } from '../entities/application.entity';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsEnum(ApplicationType)
  @IsOptional()
  type?: ApplicationType;

  @IsObject()
  @IsOptional()
  metadata?: {
    productId?: string;
    categoryId?: string;
    source?: string;
    [key: string]: any;
  };
}

