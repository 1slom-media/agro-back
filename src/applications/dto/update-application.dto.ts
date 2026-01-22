import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApplicationStatus } from '../entities/application.entity';

export class UpdateApplicationDto {
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

  @IsString()
  @IsOptional()
  adminNotes?: string;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}

