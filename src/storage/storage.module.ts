import { Global, Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ImageStorageService } from './image-storage.service';
import { StorageController } from './storage.controller';

@Global()
@Module({
  controllers: [StorageController],
  providers: [MinioService, ImageStorageService],
  exports: [MinioService, ImageStorageService],
})
export class StorageModule {}
