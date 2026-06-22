import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiJwtAuth } from '../auth/decorators/api-jwt-auth.decorator';
import { MinioService } from './minio.service';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly minioService: MinioService) {}

  @ApiJwtAuth()
  @Post('fix-bucket-policy')
  @ApiOperation({
    summary: 'Apply public read policy to MinIO bucket (fix AccessDenied in browser)',
  })
  async fixBucketPolicy() {
    await this.minioService.applyPublicReadPolicy();
    return { success: true, message: 'MinIO public read policy applied' };
  }
}
